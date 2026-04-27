require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { syncBlockchain } = require('./services/syncService');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// DB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB Connected');
        syncBlockchain();
    })
    .catch((err) => console.error('MongoDB Connection Error:', err));

// Routes
app.use('/api/wallet', require('./routes/walletRoutes'));

// Basic Route
app.get('/', (req, res) => {
    res.send('Hybrid Wallet Backend API is running...');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
