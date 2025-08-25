import sqlite3

def check_database_schema():
    try:
        conn = sqlite3.connect('all/database.db')
        cursor = conn.cursor()
        
        # Get all tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        
        print("Database Tables:")
        for table in tables:
            table_name = table[0]
            print(f"\nTable: {table_name}")
            print("-" * 40)
            
            # Get table schema
            cursor.execute(f"PRAGMA table_info({table_name})")
            columns = cursor.fetchall()
            
            for col in columns:
                print(f"  {col[1]} ({col[2]}) - Primary: {col[5]}")
        
        conn.close()
        
    except Exception as e:
        print(f"Error checking database schema: {e}")

if __name__ == "__main__":
    check_database_schema()
