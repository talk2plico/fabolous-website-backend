const express = require('express');
const router = express.Router();
const Newsletter = require('../models/Newsletter');

// Subscribe to the newsletter
router.post('/subscribe', async (req, res) => {
    const { email } = req.body;

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
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
