const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get all products or products with optional search query
router.get('/', async (req, res) => {
    const { search } = req.query;

    let query = {};
    if (search) {
        query = {
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } }
            ]
        };
    }

    try {
        const products = await Product.find(query);
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a new product
router.post('/', async (req, res) => {
    const { name, description, price, category, affiliateLink } = req.body;

    const product = new Product({
        name,
        description,
        price,
        category,
        affiliateLink
    });

    try {
        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
