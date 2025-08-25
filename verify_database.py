import sqlite3
import os

def check_database_schema():
    # Check if database exists
    db_path = 'all/database.db'
    if not os.path.exists(db_path):
        print("Database does not exist.")
        return
    
    # Connect to the database
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Check the schema of the tickets table
    cursor.execute("PRAGMA table_info(tickets)")
    columns = cursor.fetchall()
    
    print("Tickets Table Schema:")
    for col in columns:
        print(f"  {col[1]} ({col[2]}) - {'NOT NULL' if col[3] else 'NULLABLE'}")
    
    # Check the schema of the chat_logs table
    cursor.execute("PRAGMA table_info(chat_logs)")
    columns = cursor.fetchall()
    
    print("\nChat Logs Table Schema:")
    for col in columns:
        print(f"  {col[1]} ({col[2]}) - {'NOT NULL' if col[3] else 'NULLABLE'}")
    
    # Check if there are any records in the tickets table
    cursor.execute("SELECT COUNT(*) FROM tickets")
    count = cursor.fetchone()[0]
    print(f"\nNumber of records in tickets table: {count}")
    
    # Check if there are any records in the chat_logs table
    cursor.execute("SELECT COUNT(*) FROM chat_logs")
    count = cursor.fetchone()[0]
    print(f"Number of records in chat_logs table: {count}")
    
    conn.close()

if __name__ == "__main__":
    check_database_schema()
