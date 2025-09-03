from flask import Flask, render_template, request, redirect, url_for
import sqlite3, os
from chatbot import get_response
from werkzeug.utils import secure_filename

app = Flask(__name__, template_folder='templates', static_folder='static')
app.config['UPLOAD_FOLDER'] = 'uploads'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'docx'}

# Create uploads folder if not exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# DB setup
def init_db():
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS tickets (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT,
                    issue TEXT
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
    if request.method == 'POST':
        user_input = request.form['query']
        response = get_response(user_input)
    return render_template('chatbot.html', response=response)

@app.route('/submit', methods=['GET', 'POST'])
def submit():
    if request.method == 'POST':
        name = request.form['name']
        issue = request.form['issue']
        conn = sqlite3.connect('database.db')
        c = conn.cursor()
        c.execute("INSERT INTO tickets (name, issue) VALUES (?, ?)", (name, issue))
        conn.commit()
        conn.close()
        return redirect('/')
    return render_template('submit.html')

@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    message = ""
    if request.method == 'POST':
        file = request.files['file']
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            message = f"File '{filename}' uploaded successfully!"
    return render_template('upload.html', message=message)

@app.route('/admin')
def admin():
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute("SELECT * FROM tickets")
    data = c.fetchall()
    conn.close()
    return render_template('admin.html', tickets=data)

if __name__ == '__main__':
    app.run(debug=True)