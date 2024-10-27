const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const { protect } = require('../middleware/authMiddleware');

// Add a product to the wishlist
router.post('/:productId', protect, async (req, res) => {
    const { productId } = req.params;

    try {
        // Validate product ID
        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if the product is already in the wishlist
        const existingEntry = await Wishlist.findOne({ userId: req.user._id, productId });
        if (existingEntry) {
            return res.status(400).json({ message: 'Product is already in your wishlist' });
        }

        const wishlistItem = new Wishlist({
            userId: req.user._id,
            productId
        });

        await wishlistItem.save();
        res.status(201).json({ message: 'Product added to wishlist', wishlistItem });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// Get all wishlist items for a user
router.get('/', protect, async (req, res) => {
    try {
        const wishlist = await Wishlist.find({ userId: req.user._id }).populate('productId');
        res.json({ wishlist });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// Remove a product from the wishlist
router.delete('/:productId', protect, async (req, res) => {
    const { productId } = req.params;

    try {
        // Validate product ID
        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        const wishlistItem = await Wishlist.findOneAndDelete({ userId: req.user._id, productId });
        if (!wishlistItem) {
            return res.status(404).json({ message: 'Product not found in your wishlist' });
        }

        res.json({ message: 'Product removed from wishlist' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

module.exports = router;
