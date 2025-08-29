const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// In-memory user storage (replace with database in production)
let users = [];
let nextUserId = 1;

// JWT secret (should be in environment variables in production)
const JWT_SECRET = 'village_help_desk_secret_key_2023';

// User registration
router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, phone, address, password, confirmPassword } = req.body;

        // Validation
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            return res.status(400).json({ 
                success: false, 
                message: 'All required fields must be filled' 
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ 
                success: false, 
                message: 'Passwords do not match' 
            });
        }

        if (password.length < 8) {
            return res.status(400).json({ 
                success: false, 
                message: 'Password must be at least 8 characters long' 
            });
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide a valid email address' 
            });
        }

        // Check if user already exists
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            return res.status(409).json({ 
                success: false, 
                message: 'User with this email already exists' 
            });
        }

        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create user object
        const user = {
            id: nextUserId++,
            firstName,
            lastName,
            email: email.toLowerCase(),
            phone: phone || '',
            address: address || '',
            password: hashedPassword,
            role: 'user', // Default role
            isActive: true,
            createdAt: new Date(),
            lastLogin: null
        };

        // Save user (in production, save to database)
        users.push(user);

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: user.id, 
                email: user.email,
                role: user.role 
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: userWithoutPassword,
                token
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});

// User login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email and password are required' 
            });
        }

        // Find user
        const user = users.find(u => u.email === email.toLowerCase() && u.isActive);
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }

        // Update last login
        user.lastLogin = new Date();

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: user.id, 
                email: user.email,
                role: user.role 
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: userWithoutPassword,
                token
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});

// Get current user profile
router.get('/profile', authenticateToken, (req, res) => {
    try {
        const user = users.find(u => u.id === req.user.userId);
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        // Remove password from response
        const { password, ...userWithoutPassword } = user;

        res.json({
            success: true,
            data: userWithoutPassword
        });

    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
    try {
        const { firstName, lastName, phone, address } = req.body;
        const userIndex = users.findIndex(u => u.id === req.user.userId);

        if (userIndex === -1) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        // Update user data
        if (firstName) users[userIndex].firstName = firstName;
        if (lastName) users[userIndex].lastName = lastName;
        if (phone !== undefined) users[userIndex].phone = phone;
        if (address !== undefined) users[userIndex].address = address;

        // Remove password from response
        const { password, ...updatedUser } = users[userIndex];

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: updatedUser
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});

// Change password
router.put('/change-password', authenticateToken, async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;
        const userIndex = users.findIndex(u => u.id === req.user.userId);

        if (userIndex === -1) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        // Validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ 
                success: false, 
                message: 'All password fields are required' 
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ 
                success: false, 
                message: 'New passwords do not match' 
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ 
                success: false, 
                message: 'New password must be at least 8 characters long' 
            });
        }

        // Verify current password
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, users[userIndex].password);
        if (!isCurrentPasswordValid) {
            return res.status(401).json({ 
                success: false, 
                message: 'Current password is incorrect' 
            });
        }

        // Hash new password
        const saltRounds = 12;
        users[userIndex].password = await bcrypt.hash(newPassword, saltRounds);

        res.json({
            success: true,
            message: 'Password changed successfully'
        });

    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});

// Logout (client-side token removal)
router.post('/logout', (req, res) => {
    res.json({
        success: true,
        message: 'Logged out successfully'
    });
});

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'Access token required' 
        });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ 
                success: false, 
                message: 'Invalid or expired token' 
            });
        }
        req.user = user;
        next();
    });
}

// Helper function to validate email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Get all users (for admin purposes - remove in production or add proper auth)
router.get('/users', (req, res) => {
    const usersWithoutPasswords = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    });
    
    res.json({
        success: true,
        data: usersWithoutPasswords
    });
});

module.exports = router;
