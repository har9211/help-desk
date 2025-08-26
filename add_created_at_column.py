#!/usr/bin/env python3
"""
Script to add created_at column to admins table
"""

import sqlite3

def add_created_at_column():
    """Add created_at column to admins table"""
    try:
        conn = sqlite3.connect('all/database.db')
        c = conn.cursor()
        
        # Check if created_at column already exists
        c.execute('PRAGMA table_info(admins)')
        columns = c.fetchall()
        created_at_exists = any(col[1] == 'created_at' for col in columns)
        
        if created_at_exists:
            print("✓ created_at column already exists")
        else:
            # Add created_at column without default first
            c.execute("ALTER TABLE admins ADD COLUMN created_at TIMESTAMP")
            print("✓ Added created_at column to admins table")
            
            # Update existing records with current timestamp
            c.execute("UPDATE admins SET created_at = CURRENT_TIMESTAMP")
            print("✓ Updated existing records with current timestamp")
            
            conn.commit()
            
        conn.close()
        
    except Exception as e:
        print(f"Error adding column: {e}")

if __name__ == "__main__":
    add_created_at_column()
