const express = require('express');
const router = express.Router();
const Newsletter = require('../models/Newsletter');
const { protect, admin } = require('../middleware/authMiddleware'); // Assuming you have these middleware functions

// Subscribe to the newsletter
router.post('/subscribe', async (req, res) => {
    const { email } = req.body;

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email address' });
    }

    try {
        // Check if the email is already subscribed
        const existingSubscriber = await Newsletter.findOne({ email });
        if (existingSubscriber) {
            return res.status(400).json({ message: 'Email is already subscribed' });
        }

        const subscriber = new Newsletter({ email });
        await subscriber.save();
        res.status(201).json({ message: 'Successfully subscribed to the newsletter' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// Get all newsletter subscribers (Admin Only)
router.get('/', protect, admin, async (req, res) => {
    try {
        const subscribers = await Newsletter.find();
        res.json({ subscribers });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

module.exports = router;
