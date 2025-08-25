from flask import Flask, render_template, session, redirect, url_for
import sqlite3

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'  # Add a secret key for sessions

@app.route('/admin')
def admin_dashboard():
    if 'admin_id' not in session:
        return redirect(url_for('login'))

    try:
        conn = sqlite3.connect('database.db')
        cursor = conn.cursor()

        # Fetch admin data
        cursor.execute("SELECT * FROM admins WHERE admin_id=?", (session['admin_id'],))
        admin = cursor.fetchone()

        # Fetch submitted issues
        cursor.execute("SELECT * FROM issues")
        issues = cursor.fetchall()

        conn.close()

        if not admin:
            return render_template('admin.html', error="Error loading admin data", issues=[])

        return render_template('admin.html', admin=admin, issues=issues)
    except Exception as e:
        return render_template('admin.html', error=f"Database error: {e}", issues=[])

if __name__ == "__main__":
    app.run(debug=True)