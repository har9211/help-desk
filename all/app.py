from flask import Flask, render_template, request, redirect, url_for, flash, send_file, session # type: ignore
import sqlite3, os
from chatbot import get_response
from werkzeug.utils import secure_filename # type: ignore
import logging
from datetime import datetime
import tempfile
from gtts import gTTS  
import io

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
        
        # Create admins table for proper authentication
        c.execute('''CREATE TABLE IF NOT EXISTS admins (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        admin_id TEXT NOT NULL UNIQUE,
                        password TEXT NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )''')
        
        # Create emergency contacts table
        c.execute('''CREATE TABLE IF NOT EXISTS emergency_contacts (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT NOT NULL,
                        phone TEXT NOT NULL,
                        email TEXT,
                        description TEXT
                    )''')
        
        # Insert default admin if not exists
        c.execute("SELECT COUNT(*) FROM admins WHERE admin_id = 'admin'")
        if c.fetchone()[0] == 0:
            c.execute("INSERT INTO admins (admin_id, password) VALUES (?, ?)", 
                     ('admin', 'password'))  # Default password, should be changed in production
        
        # Insert default emergency contacts if not exists
        c.execute("SELECT COUNT(*) FROM emergency_contacts")
        if c.fetchone()[0] == 0:
            default_contacts = [
                ('Emergency Ambulance', '108', '', '24x7 emergency ambulance service'),
                ('Police Emergency', '100', '', 'Police emergency helpline'),
                ('Fire Department', '101', '', 'Fire emergency service'),
                ('Women Helpline', '1091', '', 'Women safety and support'),
                ('Child Helpline', '1098', '', 'Child protection services')
            ]
            c.executemany("INSERT INTO emergency_contacts (name, phone, email, description) VALUES (?, ?, ?, ?)", default_contacts)
        
        conn.commit()
        conn.close()
        logger.info("Database initialized successfully with enhanced schema including admin and emergency contacts tables")
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
    if 'chat_history' not in session:
        session['chat_history'] = []
    chat_history = session['chat_history']

    if request.method == 'POST':
        user_input = request.form.get('query', '').strip()
        language = request.form.get('language', 'en')
        if user_input:
            # Add user message
            chat_history.append({'sender': 'user', 'text': user_input})
            # Get bot response
            bot_response = get_response(user_input)
            chat_history.append({'sender': 'bot', 'text': bot_response})
            session['chat_history'] = chat_history

    return render_template('chatbot.html', chat_history=chat_history)

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

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        admin_id = request.form.get('admin_id')
        password = request.form.get('password')
        
        logger.info(f"Login attempt with Admin ID: {admin_id}")
        
        # Check credentials against database
        conn = get_db_connection()
        if conn:
            try:
                c = conn.cursor()
                c.execute("SELECT * FROM admins WHERE admin_id = ? AND password = ?", (admin_id, password))
                admin = c.fetchone()
                
                if admin:
                    # Successful login - redirect to admin dashboard
                    flash("Login successful!", "success")
                    return redirect(url_for('admin'))
                else:
                    flash("Invalid credentials. Please try again.", "error")
            except Exception as e:
                logger.error(f"Error during login: {e}")
                flash("An error occurred during login. Please try again.", "error")
            finally:
                conn.close()
        else:
            flash("Database connection error. Please try again.", "error")
    
    return render_template('login.html')

@app.route('/emergency')
def emergency_contacts():
    conn = get_db_connection()
    if not conn:
        flash("Database connection error.", "error")
        return render_template('emergency_contacts.html', contacts=[])

    try:
        c = conn.cursor()
        
        # Fetch emergency contacts
        c.execute("SELECT * FROM emergency_contacts ORDER BY name")
        contacts = c.fetchall()

        return render_template('emergency_contacts.html', contacts=contacts)
        
    except Exception as e:
        logger.error(f"Error fetching emergency contacts: {e}")
        flash("Error loading emergency contacts.", "error")
        return render_template('emergency_contacts.html', contacts=[])
    finally:
        conn.close()

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

@app.route('/text-to-speech')
def text_to_speech():
    """Generate speech audio from text"""
    text = request.args.get('text', '')
    lang = request.args.get('lang', 'en')
    
    if not text:
        return "No text provided", 400
    
    try:
        # Create text-to-speech audio
        tts = gTTS(text=text, lang=lang, slow=False)
        
        # Create in-memory file
        audio_file = io.BytesIO()
        tts.write_to_fp(audio_file)
        audio_file.seek(0)
        
        return send_file(
            audio_file,
            mimetype='audio/mpeg',
            as_attachment=True,
            download_name='speech.mp3'
        )
        
    except Exception as e:
        logger.error(f"Text-to-speech error: {e}")
        return "Error generating speech", 500

if __name__ == '__main__':
    # Create uploads directory if it doesn't exist
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    
    # For development only. In production use a WSGI server.
    app.run(debug=True, host='0.0.0.0', port=5000)
