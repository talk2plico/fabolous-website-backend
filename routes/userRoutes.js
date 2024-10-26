const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const { authenticate } = require('../middleware/authMiddleware'); // Assuming you have an auth middleware

// Get all users
router.get('/', authenticate, async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclude password from the response
        res.json({ success: true, users });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Register a new user
router.post('/register', 
    [
        body('username').isString().notEmpty().trim(),
        body('email').isEmail().normalizeEmail(),
        body('password').isLength({ min: 6 })
    ], 
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { username, email, password } = req.body;

        try {
            const existingUser  = await User.findOne({ email });
            if (existingUser ) {
                return res.status(400).json({ success: false, message: 'Email already in use' });
            }

            // Hash the password before saving
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({
                username,
                email,
                password: hashedPassword
            });

            const savedUser  = await user.save();
            res.status(201).json({ success: true, user: { id: savedUser ._id, username: savedUser .username, email: savedUser .email } });
        } catch (err) {
            res.status(400).json({ success: false, message: err.message });
        }
    }
);

// Update user role
router.put('/:id', authenticate, async (req, res) => {
    const { role } = req.body;

    if (role !== 'admin' && role !== 'user') {
        return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    try {
        const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password'); // Exclude password
        if (!user) {
            return res.status(404).json({ success: false, message: 'User  not found' });
        }
        res.json({ success: true, user });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// Delete user
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User  not found' });
        }
        res.json({ success: true, message: 'User  deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
