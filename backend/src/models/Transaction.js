const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['DEPOSIT', 'WITHDRAW', 'INTERNAL_TRANSFER'],
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    txHash: {
        type: String,
        unique: true,
        sparse: true
    },
    from: {
        type: String,
        lowercase: true
    },
    to: {
        type: String,
        lowercase: true
    },
    status: {
        type: String,
        enum: ['PENDING', 'CONFIRMED', 'FAILED'],
        default: 'CONFIRMED'
    }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
