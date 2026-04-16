# Hybrid Crypto Wallet - Smart Contracts

This folder contains the smart contracts for the **Hybrid Crypto Wallet System**. The system is designed to handle on-chain ETH deposits and withdrawals while providing events for off-chain syncing.

## Core Contract: HybridVault.sol

The `HybridVault` contract is a secure, non-upgradable vault that allows users to:
- **Deposit ETH**: Direct transfers or via the `deposit()` function.
- **Withdraw ETH**: Securely withdraw balance with reentrancy protection.
- **Track Balances**: Internal mapping for user-level accounting.

### Features
- **ReentrancyGuard**: Prevents reentrancy attacks during withdrawals.
- **Custom Errors**: Gas-efficient error handling (`InvalidAmount`, `InsufficientBalance`).
- **NatSpec**: Full documentation for production readiness.
- **Events**: `Deposit` and `Withdraw` events for backend syncing.

---

## Getting Started

### 1. Prerequisites
Ensure you have Node.js installed. Then, install dependencies:
```bash
npm install
```

### 2. Environment Setup
Create a `.env` file in the `contracts` directory:
```env
INFURA_API_KEY=your_infura_key
PRIVATE_KEY=your_wallet_private_key
```

### 3. Compile Contracts
```bash
npx hardhat compile
```

### 4. Run Tests
```bash
npx hardhat test
```

### 5. Deployment
**To Local Network:**
```bash
npx hardhat run scripts/deploy.js
```

**To Sepolia Testnet:**
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

---

## Folder Structure
- `contracts/`: Solidity source files.
- `test/`: Hardhat test suite (`HybridVault.js`).
- `scripts/`: Deployment scripts.
- `hardhat.config.js`: Hardhat configuration (Supports Sepolia).
