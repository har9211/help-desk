const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Import route handlers
const authRoutes = require('./routes/auth');
const issueRoutes = require('./routes/issues');
const marketplaceRoutes = require('./routes/marketplace');
const newsRoutes = require('./routes/news');
const educationRoutes = require('./routes/education');
const jobRoutes = require('./routes/jobs');
const governmentRoutes = require('./routes/government');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            fontSrc: ["'self'", "https://cdnjs.cloudflare.com"],
            imgSrc: ["'self'", "data:", "https:"]
        }
    }
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// CORS configuration
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://yourdomain.com'] 
        : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true
}));

// Body parsing middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Session middleware
app.use(session({
    secret: 'village_help_desk_session_secret_2023',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Static files serving
app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: '1d', // Cache static assets for 1 day
    setHeaders: (res, path) => {
        if (path.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache');
        }
    }
}));

// Serve admin panel
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/government', governmentRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Serve main application for all other routes (SPA support)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({
            success: false,
            message: 'Invalid JSON payload'
        });
    }
    
    res.status(500).json({
        success: false,
        message: process.env.NODE_ENV === 'production' 
            ? 'Internal server error' 
            : err.message
    });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'API endpoint not found'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Village Help Desk server running on port ${PORT}`);
    console.log(`📱 Local: http://localhost:${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    
    // Log available endpoints
    console.log('\n📋 Available API Endpoints:');
    console.log('   GET    /api/health          - Health check');
    console.log('   POST   /api/auth/register   - User registration');
    console.log('   POST   /api/auth/login      - User login');
    console.log('   GET    /api/auth/profile    - Get user profile');
    console.log('   PUT    /api/auth/profile    - Update profile');
    console.log('   PUT    /api/auth/change-password - Change password');
    console.log('   POST   /api/auth/logout     - User logout');
    console.log('   GET    /api/issues          - Get issues');
    console.log('   POST   /api/issues          - Create issue');
    console.log('   GET    /api/marketplace     - Marketplace items');
    console.log('   GET    /api/news            - News articles');
    console.log('   GET    /api/education       - Education materials');
    console.log('   GET    /api/jobs            - Job listings');
    console.log('   GET    /api/government      - Government services');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server gracefully...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
    process.exit(0);
});

module.exports = app;
