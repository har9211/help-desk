import sqlite3

def test_admin_table():
    try:
        conn = sqlite3.connect('database.db')
        cursor = conn.cursor()
        
        # Check if admin table exists
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='admins'")
        table_exists = cursor.fetchone()
        
        if table_exists:
            print("✅ Admin table exists")
            
            # Check if default admin exists
            cursor.execute("SELECT * FROM admins WHERE admin_id='admin'")
            admin = cursor.fetchone()
            
            if admin:
                print("✅ Default admin account exists")
                print(f"Admin ID: {admin[1]}")
                print(f"Password: {admin[2]}")
            else:
                print("❌ Default admin account not found")
        else:
            print("❌ Admin table does not exist")
            
        conn.close()
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_admin_table()
