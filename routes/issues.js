
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });


// Get all issues
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Issues endpoint - work in progress',
        data: []
    });
});

// New submit endpoint to handle form submission with file uploads
router.post('/submit', upload.array('files'), (req, res) => {
    try {
        const { name, email, issue } = req.body;
        const files = req.files;

        if (!name || !email || !issue) {
            return res.status(400).json({ success: false, message: 'Name, email, and issue description are required.' });
        }

        // Here you would typically save the issue and file info to the database
        // For now, just return success with received data

        res.json({
            success: true,
            message: 'Issue submitted successfully',
            data: {
                name,
                email,
                issue,
                files: files.map(file => ({
                    originalname: file.originalname,
                    filename: file.filename,
                    path: file.path,
                    size: file.size
                }))
            }
        });
    } catch (error) {
        console.error('Error submitting issue:', error);
        res.status(500).json({ success: false, message: 'Server error submitting issue' });
    }
});


// Create new issue
// Removed duplicate placeholder endpoint to avoid redundancy

// Get single issue
router.get('/:id', (req, res) => {
    res.json({
        success: true,
        message: 'Single issue endpoint - work in progress',
        data: {}
    });
});

// Update issue
router.put('/:id', (req, res) => {
    res.json({
        success: true,
        message: 'Issue update endpoint - work in progress',
        data: {}
    });
});

// Delete issue
router.delete('/:id', (req, res) => {
    res.json({
        success: true,
        message: 'Issue deletion endpoint - work in progress',
        data: {}
    });
});

module.exports = router;
