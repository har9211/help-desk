#!/usr/bin/env python3
"""
Script to check the database schema
"""

import sqlite3

def check_admin_table():
    """Check the structure of the admins table"""
    try:
        conn = sqlite3.connect('all/database.db')
        c = conn.cursor()
        
        # Check if admins table exists
        c.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='admins'")
        table_exists = c.fetchone()
        
        if table_exists:
            print("✓ Admins table exists")
            
            # Get table structure
            c.execute('PRAGMA table_info(admins)')
            columns = c.fetchall()
            
            print("Admins table columns:")
            for col in columns:
                print(f"  {col[1]} ({col[2]})")
                
            # Check if created_at column exists
            created_at_exists = any(col[1] == 'created_at' for col in columns)
            if created_at_exists:
                print("✓ created_at column exists in admins table")
            else:
                print("✗ created_at column missing from admins table")
                
        else:
            print("✗ Admins table does not exist")
            
        conn.close()
        
    except Exception as e:
        print(f"Error checking database: {e}")

if __name__ == "__main__":
    check_admin_table()
