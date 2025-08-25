import sqlite3
import os

def check_database_structure():
    """Check the structure of the SQLite database"""
    db_path = 'all/database.db'
    
    if not os.path.exists(db_path):
        print(f"❌ Database file not found at {db_path}")
        return False
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Get all tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        
        print("📊 Database Structure Analysis")
        print("=" * 50)
        print(f"Database file: {db_path}")
        print(f"File size: {os.path.getsize(db_path)} bytes")
        print(f"Tables found: {len(tables)}")
        
        for table_info in tables:
            table_name = table_info[0]
            print(f"\n📋 Table: {table_name}")
            print("-" * 30)
            
            # Get table schema
            cursor.execute(f"PRAGMA table_info({table_name})")
            columns = cursor.fetchall()
            
            for col in columns:
                col_id, col_name, col_type, not_null, default_val, pk = col
                print(f"  Column {col_id}: {col_name} ({col_type})")
                if pk:
                    print(f"    Primary Key: Yes")
                if not_null:
                    print(f"    Not Null: Yes")
                if default_val:
                    print(f"    Default: {default_val}")
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Error analyzing database: {e}")
        return False

if __name__ == "__main__":
    check_database_structure()
