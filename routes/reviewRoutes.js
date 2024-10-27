const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Product = require('../models/Product');
const { protect } = require('../middleware/authMiddleware');

// Submit a new review
router.post('/:productId', protect, async (req, res) => {
    const { rating, comment } = req.body;

    // Basic validation
    if (!rating || !comment) {
        return res.status(400).json({ message: 'Rating and comment are required' });
    }

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
        console.error(err); // Log the error for debugging
        res.status(500).json({ message: 'Server error, please try again later' });
    }
});

// Get all reviews for a product
router.get('/:productId', async (req, res) => {
    try {
        const reviews = await Review.find({ productId: req.params.productId })
            .populate('userId', 'username'); // Populate userId with username

        if (!reviews.length) {
            return res.status(404).json({ message: 'No reviews found for this product' });
        }

        res.json(reviews);
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ message: 'Server error, please try again later' });
    }
});

module.exports = router;
