const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    amount: Number,
    currency: String,
    status: String,
    payment_method: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Transaction", TransactionSchema);
