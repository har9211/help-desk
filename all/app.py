from flask import Flask, render_template, request, redirect, url_for, flash # type: ignore
import sqlite3, os
from chatbot import get_response
from werkzeug.utils import secure_filename # type: ignore
from googletrans import Translator # type: ignore
import logging
from datetime import datetime

app = Flask(__name__, template_folder='templates', static_folder='static')
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
app.secret_key = 'your-secret-key-here'  # Change this in production
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'docx', 'doc'}

# Configure logging
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(levelname)s - %(message)s',
                    handlers=[
                        logging.FileHandler("app.log"),
                        logging.StreamHandler()
                    ])
logger = logging.getLogger(__name__)

translator = Translator()

# DB setup
def init_db():
    try:
        conn = sqlite3.connect('database.db')
        c = conn.cursor()

        # Enhanced tickets table with additional fields
        c.execute('''CREATE TABLE IF NOT EXISTS tickets (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT NOT NULL,
                        email TEXT,
                        phone TEXT,
                        location TEXT NOT NULL,
                        category TEXT NOT NULL,
                        issue TEXT NOT NULL,
                        file_path TEXT,
                        status TEXT DEFAULT 'pending',
                        priority TEXT DEFAULT 'medium',
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )''')

        # Chat logs table
        c.execute('''CREATE TABLE IF NOT EXISTS chat_logs (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        user_input TEXT NOT NULL,
                        bot_response TEXT NOT NULL,
                        language TEXT,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )''')
        
        # Create unanswered queries table if it doesn't exist
        c.execute('''CREATE TABLE IF NOT EXISTS unanswered_queries (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        query TEXT,
                        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )''')
        
        conn.commit()
        conn.close()
        logger.info("Database initialized successfully with enhanced schema")
    except Exception as e:
        logger.error(f"Error initializing database: {e}")

def get_db_connection():
    """Get a database connection with proper error handling"""
    try:
        conn = sqlite3.connect('database.db')
        conn.row_factory = sqlite3.Row
        return conn
    except Exception as e:
        logger.error(f"Database connection error: {e}")
        return None

init_db()

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/test')
def test_page():
    try:
        conn = get_db_connection()
        if conn:
            return "Database connection successful!", 200
        else:
            return "Database connection failed!", 500
    except Exception as e:
        logger.error(f"Test route error: {e}")
        return "Error occurred while testing the database connection.", 500
def test():
    return render_template('index.html')

@app.route('/chatbot', methods=['GET', 'POST'])
def chatbot():
    logger.info("Chatbot route accessed.")
    response = ""
    user_input = ""
    selected_lang = request.args.get("language", "en")
    
    if request.method == 'POST':
        user_input = request.form.get('query', '').strip()
        selected_lang = request.form.get("language", selected_lang)

        if user_input:
            try:
                # Get response from chatbot core
                raw_response = get_response(user_input)

                # Translate response based on chosen language
                if selected_lang != "en":
                    try:
                        response = translator.translate(raw_response, dest=selected_lang).text
                    except Exception as e:
                        logger.warning(f"Translation failed: {e}")
                        response = raw_response  # fallback if translation fails
                else:
                    response = raw_response

                # Save chat log in DB
                conn = get_db_connection()
                if conn:
                    try:
                        c = conn.cursor()
                        c.execute("INSERT INTO chat_logs (user_input, bot_response, language) VALUES (?, ?, ?)",
                                  (user_input, response, selected_lang))
                        conn.commit()
                    except Exception as e:
                        logger.error(f"Error saving chat log: {e}")
                        flash("Error saving chat log.", "error")
                    finally:
                        conn.close()
                else:
                    flash("Database connection error. Chat log not saved.", "error")

            except Exception as e:
                logger.error(f"Error processing chatbot request: {e}")
                response = "Sorry, there was an error processing your request. Please try again."
                flash("An error occurred while processing your request.", "error")

    return render_template('chatbot.html', response=response, query=user_input, language=selected_lang)

@app.route('/submit', methods=['GET', 'POST'])
def submit():
    if request.method == 'POST':
        # Get all form data
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip()
        phone = request.form.get('phone', '').strip()
        location = request.form.get('location', '').strip()
        category = request.form.get('category', '').strip()
        issue = request.form.get('issue', '').strip()
        file = request.files.get('file')

        # Enhanced validation
        if not name or not location or not category or not issue:
            flash("Name, location, category, and issue description are required fields.", "error")
            return render_template('submit.html')

        # Validate email format if provided
        if email and '@' not in email:
            flash("Please enter a valid email address.", "error")
            return render_template('submit.html')

        file_path = None
        # File upload handling
        if file and file.filename:
            if allowed_file(file.filename):
                try:
                    filename = secure_filename(file.filename)
                    # Create uploads directory if it doesn't exist
                    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
                    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                    file.save(filepath)
                    file_path = filepath
                    flash(f"File '{filename}' uploaded successfully!", "success")
                except Exception as e:
                    logger.error(f"File upload error: {e}")
                    flash("Error uploading file. Please try again.", "error")
            else:
                flash("Invalid file type. Please upload .txt, .pdf, or .docx files.", "error")

        # Save to DB with enhanced fields
        conn = get_db_connection()
        if conn:
            try:
                c = conn.cursor()
                c.execute('''INSERT INTO tickets 
                            (name, email, phone, location, category, issue, file_path) 
                            VALUES (?, ?, ?, ?, ?, ?, ?)''',
                          (name, email or None, phone or None, location, category, issue, file_path))
                conn.commit()
                flash("Your issue has been submitted successfully! We'll get back to you soon.", "success")
            except Exception as e:
                logger.error(f"Error saving ticket: {e}")
                flash("Error submitting your issue. Please try again.", "error")
            finally:
                conn.close()
        else:
            flash("Database connection error. Please try again.", "error")

        return redirect(url_for('home'))
    
    return render_template('submit.html')

@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    message = ""
    if request.method == 'POST':
        file = request.files.get('file')
        if file and file.filename:
            if allowed_file(file.filename):
                try:
                    filename = secure_filename(file.filename)
                    # Create uploads directory if it doesn't exist
                    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
                    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                    file.save(filepath)
                    message = f"File '{filename}' uploaded successfully!"
                    flash(message, "success")
                except Exception as e:
                    logger.error(f"File upload error: {e}")
                    message = "Error uploading file. Please try again."
                    flash(message, "error")
            else:
                message = "Please upload a valid file (.txt, .pdf, .docx, .doc)."
                flash(message, "error")
        else:
            message = "No file selected."
            flash(message, "error")
    
    return render_template('upload.html', message=message)

@app.route('/admin')
def admin():
    conn = get_db_connection()
    if not conn:
        flash("Database connection error.", "error")
        return render_template('admin.html', tickets=[], chats=[])

    try:
        c = conn.cursor()
        
        # Fetch tickets
        c.execute("SELECT * FROM tickets ORDER BY created_at DESC, id DESC")
        tickets = c.fetchall()

        # Fetch chat logs
        c.execute("SELECT * FROM chat_logs ORDER BY created_at DESC, id DESC")
        chats = c.fetchall()

        return render_template('admin.html', tickets=tickets, chats=chats)
        
    except Exception as e:
        logger.error(f"Error fetching admin data: {e}")
        flash("Error loading admin data.", "error")
        return render_template('admin.html', tickets=[], chats=[])
    finally:
        conn.close()

@app.errorhandler(413)
def too_large(e):
    return "File too large. Maximum size is 16MB.", 413

@app.errorhandler(404)
def not_found(e):
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_error(e):
    return render_template('500.html'), 500

if __name__ == '__main__':
    # Create uploads directory if it doesn't exist
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    
    # For development only. In production use a WSGI server.
    app.run(debug=True, host='0.0.0.0', port=5000)
