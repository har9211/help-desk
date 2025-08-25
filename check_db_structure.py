import sqlite3

def check_database_structure():
    try:
        conn = sqlite3.connect('database.db')
        cursor = conn.cursor()
        
        # Get all table names
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        
        print("Tables in the database:")
        for table in tables:
            print(f"- {table[0]}")
            
            # Get the schema for each table
            cursor.execute(f"PRAGMA table_info({table[0]})")
            columns = cursor.fetchall()
            print("  Columns:")
            for column in columns:
                print(f"    - {column[1]} ({column[2]})")
            print()
        
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_database_structure()
