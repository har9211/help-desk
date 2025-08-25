from flask import Flask, render_template, request, redirect, url_for # type: ignore
import sqlite3, os
from chatbot import get_response
from werkzeug.utils import secure_filename # type: ignore
from googletrans import Translator # type: ignore

app = Flask(__name__, template_folder='templates', static_folder='static')
app.config['UPLOAD_FOLDER'] = 'uploads'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'docx'}

translator = Translator()

# DB setup
def init_db():
    conn = sqlite3.connect('database.db')
    c = conn.cursor()

    # Tickets table
    c.execute('''CREATE TABLE IF NOT EXISTS tickets (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT,
                    issue TEXT
                )''')

    # Chat logs table
    c.execute('''CREATE TABLE IF NOT EXISTS chat_logs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_input TEXT,
                    bot_response TEXT,
                    language TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )''')
    conn.commit()
    conn.close()

init_db()

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/chatbot', methods=['GET', 'POST'])
def chatbot():
    response = ""
    user_input = ""
    selected_lang = "en"
    if request.method == 'POST':
        user_input = request.form.get('query', '').strip()
        selected_lang = request.form.get("language", "en")

        if user_input:
            # Get response from chatbot core
            raw_response = get_response(user_input)

            # Translate response based on chosen language
            if selected_lang == "hi":
                try:
                    response = translator.translate(raw_response, dest='hi').text
                except Exception:
                    response = raw_response  # fallback if translation fails
            else:
                response = raw_response

            # Save chat log in DB
            conn = sqlite3.connect('database.db')
            c = conn.cursor()
            c.execute("INSERT INTO chat_logs (user_input, bot_response, language) VALUES (?, ?, ?)",
                      (user_input, response, selected_lang))
            conn.commit()
            conn.close()

    return render_template('chatbot.html', response=response, query=user_input, language=selected_lang)

@app.route('/submit', methods=['GET', 'POST'])
def submit():
    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        issue = request.form.get('issue', '').strip()
        file = request.files.get('file')

        # Save to DB
        conn = sqlite3.connect('database.db')
        c = conn.cursor()
        c.execute("INSERT INTO tickets (name, issue) VALUES (?, ?)", (name, issue))
        conn.commit()
        conn.close()

        # File upload handling
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)

        return redirect(url_for('home'))
    return render_template('submit.html')

@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    message = ""
    if request.method == 'POST':
        file = request.files.get('file')
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            message = f"File '{filename}' uploaded successfully!"
        else:
            message = "Please upload a valid file (.txt, .pdf, .docx)."
    return render_template('upload.html', message=message)

@app.route('/admin')
def admin():
    conn = sqlite3.connect('database.db')
    c = conn.cursor()

    # Fetch tickets
    c.execute("SELECT * FROM tickets ORDER BY id DESC")
    tickets = c.fetchall()

    # Fetch chat logs
    c.execute("SELECT * FROM chat_logs ORDER BY created_at DESC, id DESC")
    chats = c.fetchall()

    conn.close()
    return render_template('admin.html', tickets=tickets, chats=chats)

if __name__ == '__main__':
    # For development only. In production use a WSGI server.
    app.run(debug=True)
