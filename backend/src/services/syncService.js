const { ethers } = require('ethers');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// Contract ABI (Extracted from artifacts)

// Load ABI from the contracts directory
const path = require('path');
const abiPath = path.resolve(__dirname, '../../../contracts/artifacts/contracts/HybridVault.sol/HybridVault.json');
const abi = require(abiPath).abi;

const syncBlockchain = async () => {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, provider);

    console.log('Blockchain Sync Service Started...');

    // Sync Historical Events (Catch up)
    const catchUp = async () => {
        const lastBlock = await provider.getBlockNumber();
       
        const startBlock = lastBlock - 1000;

        console.log(`Checking historical events from block ${startBlock}...`);

        const depositFilter = contract.filters.Deposit();
        const deposits = await contract.queryFilter(depositFilter, startBlock, lastBlock);
        for (let event of deposits) {
            await handleEvent(event.args[0], event.args[1], event.transactionHash, 'DEPOSIT');
        }

        const withdrawFilter = contract.filters.Withdraw();
        const withdraws = await contract.queryFilter(withdrawFilter, startBlock, lastBlock);
        for (let event of withdraws) {
            await handleEvent(event.args[0], event.args[1], event.transactionHash, 'WITHDRAW');
        }
        console.log('Historical Sync Complete.');
    };

    await catchUp();

    // Listen for Live Events
    contract.on("Deposit", async (userAddress, amount, event) => {
        console.log(`Deposit Detected: ${userAddress} - ${ethers.formatEther(amount)} ETH`);
        await handleEvent(userAddress, amount, event.log.transactionHash, 'DEPOSIT');
    });

    contract.on("Withdraw", async (userAddress, amount, event) => {
        console.log(`Withdraw Detected: ${userAddress} - ${ethers.formatEther(amount)} ETH`);
        await handleEvent(userAddress, amount, event.log.transactionHash, 'WITHDRAW');
    });
};

const handleEvent = async (userAddress, amount, txHash, type) => {
    try {
        // Find or Create User
        let user = await User.findOne({ walletAddress: userAddress.toLowerCase() });
        if (!user) {
            user = new User({ walletAddress: userAddress.toLowerCase() });
        }

        // Update Balances (BigInt for precision)
        const currentOnChain = BigInt(user.onChainBalance);
        const eventAmount = BigInt(amount);

        if (type === 'DEPOSIT') {
            user.onChainBalance = (currentOnChain + eventAmount).toString();
            // In a hybrid system, deposit often increases internal balance too
            user.internalBalance = (BigInt(user.internalBalance) + eventAmount).toString();
        } else if (type === 'WITHDRAW') {
            user.onChainBalance = (currentOnChain - eventAmount).toString();
            user.internalBalance = (BigInt(user.internalBalance) - eventAmount).toString();
        }

        await user.save();

        // Record Transaction
        const txExists = await Transaction.findOne({ txHash });
        if (!txExists) {
            await Transaction.create({
                user: user._id,
                type,
                amount: amount.toString(),
                txHash,
                status: 'CONFIRMED'
            });
        }

        console.log(`Database Updated for ${userAddress}`);
    } catch (error) {
        console.error('Error handling event:', error);
    }
};

module.exports = { syncBlockchain };
