const express = require('express');
const router = express.Router();

// POST endpoint for chatbot interactions
router.post('/', (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: 'Message is required'
            });
        }

        // Simple placeholder response
        const responses = [
            "I'm here to help with village services and information.",
            "You can ask me about government services, marketplace, education, or jobs.",
            "Welcome to the Village Help Desk chatbot! How can I assist you today?",
            "I can help you find information about various village services.",
            "Please let me know what you need help with."
        ];

        const randomResponse = responses[Math.floor(Math.random() * responses.length)];

        res.json({
            success: true,
            response: randomResponse,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Chatbot error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({
        success: true,
        status: 'Chatbot service is healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

module.exports = router;