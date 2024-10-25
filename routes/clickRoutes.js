const express = require('express');
const router = express.Router();
const Click = require('../models/Click');

// Register a click
router.post('/', async (req, res) => {
    const { productId, userId } = req.body;

    const click = new Click({
        productId,
        userId
    });

    try {
        const savedClick = await click.save();
        res.status(201).json(savedClick);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all clicks
router.get('/', async (req, res) => {
    try {
        const clicks = await Click.find().populate('productId').populate('userId');
        res.json(clicks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
