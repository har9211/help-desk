const express = require('express');
const router = express.Router();

// Get all news articles
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'News endpoint - work in progress',
        data: []
    });
});

// Create new news article
router.post('/', (req, res) => {
    res.json({
        success: true,
        message: 'News article creation endpoint - work in progress',
        data: {}
    });
});

// Get single news article
router.get('/:id', (req, res) => {
    res.json({
        success: true,
        message: 'Single news article endpoint - work in progress',
        data: {}
    });
});

// Update news article
router.put('/:id', (req, res) => {
    res.json({
        success: true,
        message: 'News article update endpoint - work in progress',
        data: {}
    });
});

// Delete news article
router.delete('/:id', (req, res) => {
    res.json({
        success: true,
        message: 'News article deletion endpoint - work in progress',
        data: {}
    });
});

module.exports = router;
