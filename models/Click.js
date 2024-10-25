const mongoose = require('mongoose');

const ClickSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now },
    conversionStatus: { type: Boolean, default: false } // Whether the click led to a sale
});

module.exports = mongoose.model('Click', ClickSchema);
