import sqlite3
import os

def debug_database():
    db_path = 'all/database.db'
    
    print("🔍 Debugging Database")
    print("=" * 40)
    
    # Check if database exists
    if not os.path.exists(db_path):
        print(f"❌ Database file does not exist: {db_path}")
        print("Creating a new database...")
        return create_new_database()
    
    print(f"✅ Database exists: {db_path}")
    print(f"📏 File size: {os.path.getsize(db_path)} bytes")
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Get all tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        
        print(f"📊 Number of tables: {len(tables)}")
        
        for table_info in tables:
            table_name = table_info[0]
            print(f"\n📋 Table: {table_name}")
            print("-" * 20)
            
            # Get table schema
            cursor.execute(f"PRAGMA table_info({table_name})")
            columns = cursor.fetchall()
            
            for col in columns:
                col_id, col_name, col_type, not_null, default_val, pk = col
                print(f"  {col_name}: {col_type}")
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def create_new_database():
    """Create a new database with the enhanced schema"""
    try:
        conn = sqlite3.connect('all/database.db')
        cursor = conn.cursor()
        
        # Create enhanced tickets table
        cursor.execute('''CREATE TABLE tickets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT,
            phone TEXT,
            location TEXT,
            category TEXT,
            issue TEXT NOT NULL,
            file_path TEXT,
            status TEXT DEFAULT 'pending',
            priority TEXT DEFAULT 'medium',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )''')
        
        # Create chat_logs table
        cursor.execute('''CREATE TABLE chat_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_input TEXT NOT NULL,
            bot_response TEXT NOT NULL,
            language TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )''')
        
        conn.commit()
        conn.close()
        print("✅ New database created with enhanced schema!")
        return True
        
    except Exception as e:
        print(f"❌ Error creating database: {e}")
        return False

if __name__ == "__main__":
    debug_database()
