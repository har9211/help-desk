import sqlite3

def get_database_schema():
    try:
        conn = sqlite3.connect('all/database.db')
        cursor = conn.cursor()
        
        print("=== DATABASE SCHEMA ANALYSIS ===\n")
        
        # Get all tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        
        for table in tables:
            table_name = table[0]
            print(f"TABLE: {table_name}")
            print("=" * 50)
            
            # Get table schema
            cursor.execute(f"PRAGMA table_info({table_name})")
            columns = cursor.fetchall()
            
            if not columns:
                print("  No columns found")
                continue
                
            for col in columns:
                col_id, col_name, col_type, not_null, default_val, pk = col
                pk_str = "PRIMARY KEY" if pk else ""
                not_null_str = "NOT NULL" if not_null else ""
                default_str = f"DEFAULT {default_val}" if default_val else ""
                
                print(f"  {col_name:15} {col_type:10} {pk_str:12} {not_null_str:9} {default_str}")
            
            print()
            
            # Get sample data (first 3 rows)
            try:
                cursor.execute(f"SELECT * FROM {table_name} LIMIT 3")
                sample_data = cursor.fetchall()
                if sample_data:
                    print("  Sample Data:")
                    for row in sample_data:
                        print(f"    {row}")
                    print()
            except:
                print("  Could not retrieve sample data\n")
        
        conn.close()
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    get_database_schema()
