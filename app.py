from flask import Flask, render_template, request, redirect, url_for, flash, session
import sqlite3
import os
import logging

app = Flask(__name__, template_folder='templates', static_folder='static')
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
app.secret_key = 'your-secret-key-here'  # Change this in production

# Configure logging
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(levelname)s - %(message)s',
                    handlers=[
                        logging.FileHandler("app.log"),
                        logging.StreamHandler()
                    ])
logger = logging.getLogger(__name__)

def get_db_connection():
    """Get a database connection with proper error handling"""
    try:
        conn = sqlite3.connect('database.db')
        conn.row_factory = sqlite3.Row
        return conn
    except Exception as e:
        logger.error(f"Database connection error: {e}")
        return None

@app.route('/')
def home():
    return render_template('index.html')

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
                    # Successful login - store in session and redirect to admin dashboard
                    session['admin_id'] = admin_id
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

@app.route('/admin')
def admin():
    if 'admin_id' not in session:
        return redirect(url_for('login'))
    
    conn = get_db_connection()
    if not conn:
        flash("Database connection error.", "error")
        return render_template('admin.html', tickets=[], chats=[])

    try:
        c = conn.cursor()
        
        # Fetch tickets (not issues)
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

@app.route('/logout')
def logout():
    session.pop('admin_id', None)
    flash("You have been logged out successfully.", "success")
    return redirect(url_for('home'))

if __name__ == '__main__':
    # Create uploads directory if it doesn't exist
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    
    # For development only. In production use a WSGI server.
    app.run(debug=True, host='0.0.0.0', port=5000)
