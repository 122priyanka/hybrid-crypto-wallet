const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    walletAddress: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    onChainBalance: {
        type: String, // Stored as string to handle BigInt precision (wei)
        default: '0'
    },
    internalBalance: {
        type: String, // Stored as string to handle BigInt precision (wei)
        default: '0'
    },
    lastSyncedBlock: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
