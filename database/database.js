// Database configuration for Village Help Desk
// This file provides database connection and utility functions

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file path
const DB_PATH = path.join(__dirname, 'village_help_desk.db');

// Create database connection
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database');
        initializeDatabase();
    }
});

// Initialize database tables
function initializeDatabase() {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        address TEXT,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login DATETIME,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('Error creating users table:', err.message);
        } else {
            console.log('Users table ready');
        }
    });

    // Issues table
    db.run(`CREATE TABLE IF NOT EXISTS issues (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        location TEXT,
        priority TEXT DEFAULT 'medium',
        status TEXT DEFAULT 'pending',
        assigned_to INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        resolved_at DATETIME,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (assigned_to) REFERENCES users (id)
    )`, (err) => {
        if (err) {
            console.error('Error creating issues table:', err.message);
        } else {
            console.log('Issues table ready');
        }
    });

    // Marketplace items table
    db.run(`CREATE TABLE IF NOT EXISTS marketplace_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        title TEXT NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        category TEXT NOT NULL,
        condition TEXT DEFAULT 'good',
        image_url TEXT,
        is_available BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )`, (err) => {
        if (err) {
            console.error('Error creating marketplace_items table:', err.message);
        } else {
            console.log('Marketplace items table ready');
        }
    });

    // News articles table
    db.run(`CREATE TABLE IF NOT EXISTS news_articles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        category TEXT NOT NULL,
        author_id INTEGER,
        image_url TEXT,
        is_published BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        published_at DATETIME,
        FOREIGN KEY (author_id) REFERENCES users (id)
    )`, (err) => {
        if (err) {
            console.error('Error creating news_articles table:', err.message);
        } else {
            console.log('News articles table ready');
        }
    });

    // Educational materials table
    db.run(`CREATE TABLE IF NOT EXISTS educational_materials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        category TEXT NOT NULL,
        content_type TEXT NOT NULL,
        file_url TEXT,
        author_id INTEGER,
        is_public BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES users (id)
    )`, (err) => {
        if (err) {
            console.error('Error creating educational_materials table:', err.message);
        } else {
            console.log('Educational materials table ready');
        }
    });

    // Job postings table
    db.run(`CREATE TABLE IF NOT EXISTS job_postings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        company TEXT NOT NULL,
        description TEXT NOT NULL,
        requirements TEXT,
        location TEXT,
        salary_range TEXT,
        contact_email TEXT,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        expires_at DATETIME
    )`, (err) => {
        if (err) {
            console.error('Error creating job_postings table:', err.message);
        } else {
            console.log('Job postings table ready');
        }
    });

    // Government services table
    db.run(`CREATE TABLE IF NOT EXISTS government_services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        department TEXT NOT NULL,
        contact_info TEXT,
        requirements TEXT,
        processing_time TEXT,
        fee DECIMAL(10, 2) DEFAULT 0,
        is_available BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('Error creating government_services table:', err.message);
        } else {
            console.log('Government services table ready');
        }
    });

    // Create indexes for better performance
    db.run('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)', (err) => {
        if (err) console.error('Error creating email index:', err.message);
    });

    db.run('CREATE INDEX IF NOT EXISTS idx_issues_user_id ON issues(user_id)', (err) => {
        if (err) console.error('Error creating issues user_id index:', err.message);
    });

    db.run('CREATE INDEX IF NOT EXISTS idx_issues_status ON issues(status)', (err) => {
        if (err) console.error('Error creating issues status index:', err.message);
    });
}

// Database utility functions
class Database {
    // Promisified database methods
    static run(sql, params = []) {
        return new Promise((resolve, reject) => {
            db.run(sql, params, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, changes: this.changes });
                }
            });
        });
    }

    static get(sql, params = []) {
        return new Promise((resolve, reject) => {
            db.get(sql, params, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    static all(sql, params = []) {
        return new Promise((resolve, reject) => {
            db.all(sql, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // User management
    static async createUser(userData) {
        const { firstName, lastName, email, phone, address, passwordHash } = userData;
        const sql = `INSERT INTO users (first_name, last_name, email, phone, address, password_hash) 
                     VALUES (?, ?, ?, ?, ?, ?)`;
        return this.run(sql, [firstName, lastName, email, phone, address, passwordHash]);
    }

    static async getUserByEmail(email) {
        const sql = 'SELECT * FROM users WHERE email = ?';
        return this.get(sql, [email]);
    }

    static async getUserById(id) {
        const sql = 'SELECT * FROM users WHERE id = ?';
        return this.get(sql, [id]);
    }

    static async updateUserLastLogin(userId) {
        const sql = 'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?';
        return this.run(sql, [userId]);
    }

    // Issue management
    static async createIssue(issueData) {
        const { userId, title, description, category, location, priority } = issueData;
        const sql = `INSERT INTO issues (user_id, title, description, category, location, priority) 
                     VALUES (?, ?, ?, ?, ?, ?)`;
        return this.run(sql, [userId, title, description, category, location, priority]);
    }

    static async getIssuesByUser(userId) {
        const sql = 'SELECT * FROM issues WHERE user_id = ? ORDER BY created_at DESC';
        return this.all(sql, [userId]);
    }

    static async getAllIssues() {
        const sql = 'SELECT * FROM issues ORDER BY created_at DESC';
        return this.all(sql);
    }

    // Marketplace management
    static async createMarketplaceItem(itemData) {
        const { userId, title, description, price, category, condition, imageUrl } = itemData;
        const sql = `INSERT INTO marketplace_items (user_id, title, description, price, category, condition, image_url) 
                     VALUES (?, ?, ?, ?, ?, ?, ?)`;
        return this.run(sql, [userId, title, description, price, category, condition, imageUrl]);
    }

    static async getMarketplaceItems() {
        const sql = 'SELECT * FROM marketplace_items WHERE is_available = 1 ORDER BY created_at DESC';
        return this.all(sql);
    }

    // Add more methods for other tables as needed...

    // Close database connection
    static close() {
        return new Promise((resolve, reject) => {
            db.close((err) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('Database connection closed');
                    resolve();
                }
            });
        });
    }
}

// Handle application shutdown
process.on('SIGINT', async () => {
    console.log('\nClosing database connection...');
    try {
        await Database.close();
        process.exit(0);
    } catch (err) {
        console.error('Error closing database:', err);
        process.exit(1);
    }
});

module.exports = {
    db,
    Database
};
