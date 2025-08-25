import sqlite3

def test_db():
    try:
        conn = sqlite3.connect('all/database.db')
        cursor = conn.cursor()
        
        # Check if tables exist
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        print("Tables found:", tables)
        
        # Check tickets table structure
        cursor.execute("PRAGMA table_info(tickets)")
        columns = cursor.fetchall()
        print("Tickets table columns:", columns)
        
        conn.close()
        return True
    except Exception as e:
        print("Error:", e)
        return False

if __name__ == "__main__":
    test_db()
