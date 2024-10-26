const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclude password from the response
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Register a new user
router.post('/register', 
    [
        body('username').isString().notEmpty(),
        body('email').isEmail(),
        body('password').isLength({ min: 6 })
    ], 
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, email, password } = req.body;

        try {
            // Hash the password before saving
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({
                username,
                email,
                password: hashedPassword
            });

            const savedUser  = await user.save();
            res.status(201).json({ id: savedUser ._id, username: savedUser .username, email: savedUser .email }); // Exclude password
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
);

// Update user role
router.put('/:id', async (req, res) => {
    const { role } = req.body;

    if (role !== 'admin' && role !== 'user') {
        return res.status(400).json({ message: 'Invalid role' });
    }

    try {
        const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password'); // Exclude password
        if (!user) {
            return res.status(404).json({ message: 'User  not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete user
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User  not found' });
        }
        res.json({ message: 'User  deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
