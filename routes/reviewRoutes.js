const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Product = require('../models/Product');
const { protect } = require('../middleware/authMiddleware');

// Submit a new review
router.post('/:productId', protect, async (req, res) => {
    const { rating, comment } = req.body;

    try {
        const product = await Product.findById(req.params.productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const review = new Review({
            productId: req.params.productId,
            userId: req.user._id,
            rating,
            comment
        });

        await review.save();
        res.status(201).json({ message: 'Review submitted successfully', review });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
