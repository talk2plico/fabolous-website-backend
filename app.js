const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

// Import Routes
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const clickRoutes = require('./routes/clickRoutes');
const reviewRoutes = require('./routes/reviewRoutes'); // Import review routes
const wishlistRoutes = require('./routes/wishlistRoutes');
const newsletterRoutes = require('./routes/newsletterRoutes');

// Initialize App
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to MongoDB Atlas");
}).catch(err => {
    console.error("MongoDB connection error: ", err);
});

// Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/clicks', clickRoutes);
app.use('/api/reviews', reviewRoutes); // Use review routes
app.use('/api/wishlist', wishlistRoutes); // use review routes
app.use('/api/newsletter', newsletterRoutes); // use newsletter routes

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
