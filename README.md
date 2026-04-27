# 🚀 Hybrid Crypto Wallet System

> **Status:** 🚧 In Progress

A professional "Binance-style" hybrid crypto wallet that bridges the gap between on-chain security and off-chain performance. This project demonstrates how exchanges manage user funds using a combination of smart contracts and a centralized ledger.

---

## 🏗️ Architecture Overview

The system is built on a three-tier architecture:

1.  **Blockchain Layer (On-Chain)**: 
    *   Powered by `HybridVault.sol`.
    *   Handles real ETH deposits and withdrawals securely.
    *   Emits events (`Deposit`, `Withdraw`) for synchronization.

2.  **Backend Layer (The Hybrid Engine)**:
    *   **Node.js & Express API**: Serves fast data and manages off-chain logic.
    *   **Event Syncing Service**: A real-time listener that indexes blockchain events into MongoDB. Includes a "Catch-up" mechanism for historical sync.
    *   **Off-chain Ledger**: Tracks "Internal Balances" for gasless user-to-user transfers.

3.  **Frontend Layer (React)**:
    *   Vite-powered React application.
    *   MetaMask integration for direct blockchain interactions.
    *   Dashboard for viewing dual balances (On-chain vs. Internal).

---

## 🔥 Key Features

- [x] **Smart Contract Wallet**: Real ETH storage with mapping-based accounting.
- [x] **Real-time Event Syncing**: Backend listens to blockchain events and updates MongoDB instantly.
- [x] **Historical Recovery**: Backend automatically fetches missed events on startup using `queryFilter`.
- [x] **Hybrid Balance System**: Tracks both actual on-chain funds and internal exchange balances.
- [/] **Gasless Internal Transfers**: (In Progress) Instant off-chain movement of funds.
- [ ] **WebSocket Notifications**: (Planned) Live UI updates for transaction confirmations.

---

## 📂 Project Structure

```text
hybrid-wallet/
├── contracts/          # Solidity Smart Contracts (Hardhat)
│   └── contracts/
│       └── HybridVault.sol
├── backend/            # Node.js Express API & Sync Service
│   ├── src/
│   │   ├── services/   # Blockchain listeners & sync logic
│   │   ├── models/     # MongoDB Schemas (User, Transaction)
│   │   ├── routes/     # API Endpoints
│   │   └── index.js    # Entry point
└── frontend/           # React + Vite Application
```

---

## 🛠️ Setup Instructions

### Prerequisites
- Node.js & npm
- MongoDB
- MetaMask extension

### 1. Backend Setup
```bash
cd backend
npm install
# Create a .env file and add your RPC_URL, CONTRACT_ADDRESS, and MONGODB_URI
npm run dev
```

### 2. Contracts Setup
```bash
cd contracts
npm install
npx hardhat compile
```

---

## 🛡️ License
MIT
