# Village Help Desk - Enhanced Version

A comprehensive Flask-based web application for village-level issue resolution with multilingual support, file upload capabilities, and robust error handling.

## 🚀 Features

### Core Functionality
- **Multilingual Chatbot**: AI-powered chatbot with translation support for multiple languages
- **Issue Submission**: Form-based issue reporting with file attachments
- **File Upload**: Support for .txt, .pdf, .docx, and .doc files (up to 16MB)
- **Admin Dashboard**: View all submitted tickets and chat logs
- **Database Management**: SQLite database with proper error handling

### Enhanced Features
- **Improved Error Handling**: Custom 404 and 500 error pages
- **Robust Database Operations**: Connection pooling and error recovery
- **File Validation**: Secure file uploads with type and size validation
- **Logging**: Comprehensive logging for debugging and monitoring
- **Flash Messages**: User-friendly notifications for all operations

## 🛠️ Installation & Setup

### Prerequisites
- Python 3.7+
- pip (Python package manager)

### Installation Steps

1. **Clone or navigate to the project directory**
   ```bash
   cd all
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application**
   ```bash
   python app.py
   ```

   Or use the provided scripts:
   - **Windows Batch File**: Double-click `run_app.bat`
   - **PowerShell Script**: Right-click `run_app.ps1` and select "Run with PowerShell"

4. **Access the application**
   Open your browser and go to: `http://localhost:5000`

## 📁 Project Structure

```
all/
├── app.py                 # Main Flask application
├── chatbot.py            # Enhanced chatbot logic
├── database.db           # SQLite database (auto-created)
├── requirements.txt      # Python dependencies
├── update_database.sql   # Database schema and sample data
├── uploads/              # File upload directory (auto-created)
├── static/              # CSS, JS, images
├── templates/           # HTML templates
│   ├── index.html       # Home page
│   ├── chatbot.html     # Chatbot interface
│   ├── submit.html      # Issue submission form
│   ├── upload.html      # File upload page
│   ├── admin.html       # Admin dashboard
│   ├── 404.html         # Custom 404 error page
│   └── 500.html         # Custom 500 error page
└── __pycache__/         # Python cache files
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the project root for production:

```env
FLASK_ENV=production
SECRET_KEY=your-secure-secret-key
DATABASE_URL=sqlite:///database.db
MAX_FILE_SIZE=16777216
```

### Database Schema
The application automatically creates two tables:

1. **tickets** - Stores user-submitted issues
   - id (primary key)
   - name (user name)
   - issue (problem description)
   - file_path (optional uploaded file path)
   - created_at (timestamp)

2. **chat_logs** - Stores chatbot interactions
   - id (primary key)
   - user_input
   - bot_response
   - language
   - created_at (timestamp)

## 🌐 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Home page |
| `/chatbot` | GET/POST | Chatbot interface with translation |
| `/submit` | GET/POST | Issue submission form |
| `/upload` | GET/POST | File upload page |
| `/admin` | GET | Admin dashboard |

## 🎯 Usage Examples

### Chatbot Interaction
- Ask about water issues: "water problem"
- Inquire about electricity: "bijli ka issue"
- Government schemes: "available yojana"
- Health services: "health center near me"

### File Uploads
Supported file types:
- Text files (.txt)
- PDF documents (.pdf)
- Word documents (.doc, .docx)

Maximum file size: 16MB

### Multilingual Support
The chatbot supports translation to multiple languages. Use the language dropdown to switch between English and other supported languages.

## 🚨 Error Handling

The application includes comprehensive error handling:

- **413**: File too large (max 16MB)
- **404**: Page not found
- **500**: Internal server error
- Database connection errors
- File upload validation errors
- Translation service failures

## 🔒 Security Features

- Secure file upload validation
- SQL injection prevention through parameterized queries
- File size limits
- Input sanitization
- Error message sanitization

## 📊 Logging

The application logs:
- Database operations
- File upload attempts
- Chatbot interactions
- Error conditions
- Application startup/shutdown

## 🚀 Deployment

For production deployment:

1. Set `FLASK_ENV=production`
2. Use a proper WSGI server (Gunicorn, uWSGI)
3. Configure a reverse proxy (Nginx, Apache)
4. Set up proper database backups
5. Configure SSL certificates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is open source and available under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the application logs
2. Verify database connectivity
3. Ensure file permissions are correct
4. Check available disk space

## 🔄 Updates

### Recent Improvements
- Enhanced chatbot responses with detailed information
- Improved error handling and user feedback
- Added custom error pages (404, 500)
- Better file upload validation
- Comprehensive logging system
- Database connection pooling
- Multilingual support improvements

---

**Note**: This is a development version. For production use, ensure proper security measures are implemented including HTTPS, database encryption, and regular security updates.
