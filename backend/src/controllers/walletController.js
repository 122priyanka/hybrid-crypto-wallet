const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { ethers } = require('ethers');

// Get user balances (On-chain & Internal)
// /api/wallet/balance/:address
const getBalance = async (req, res) => {
    try {
        const address = req.params.address.toLowerCase();
        let user = await User.findOne({ walletAddress: address });

        if (!user) {
            return res.json({
                onChainBalance: "0",
                internalBalance: "0",
                formattedOnChain: "0.0",
                formattedInternal: "0.0"
            });
        }

        res.json({
            onChainBalance: user.onChainBalance,
            internalBalance: user.internalBalance,
            formattedOnChain: ethers.formatEther(user.onChainBalance),
            formattedInternal: ethers.formatEther(user.internalBalance)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get transaction history
// /api/wallet/history/:address
const getHistory = async (req, res) => {
    try {
        const address = req.params.address.toLowerCase();
        const user = await User.findOne({ walletAddress: address });

        if (!user) {
            return res.json([]);
        }

        const transactions = await Transaction.find({ user: user._id })
            .sort({ createdAt: -1 });

        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getBalance,
    getHistory
};
