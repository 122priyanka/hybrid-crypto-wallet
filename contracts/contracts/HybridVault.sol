// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title HybridVault
 * @author Hybrid Crypto Wallet System
 * @notice A smart contract for managing on-chain ETH deposits and withdrawals
 * @dev Implements ReentrancyGuard for security and follows Checks-Effects-Interactions pattern
 */
contract HybridVault is ReentrancyGuard {
    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);

    error InvalidAmount();
    error withdrawFail();
    error InsufficientBalance(uint256 balance);

    mapping(address => uint256) private balances;

    /// @notice Allows the contract to receive ETH directly
    receive() external payable {
        if (msg.value > 0) {
            balances[msg.sender] += msg.value;
            emit Deposit(msg.sender, msg.value);
        }
    }

    /**
     * @notice Deposits ETH into the caller's balance
     * @dev Reverts if msg.value is 0
     */
    function deposit() external payable {
        if (msg.value == 0) revert InvalidAmount();
        balances[msg.sender] += msg.value;

        emit Deposit(msg.sender, msg.value);
    }

    /**
     * @notice Withdraws ETH from the caller's balance
     * @param amount The amount of ETH (in wei) to withdraw
     * @dev Uses ReentrancyGuard to prevent reentrancy attacks
     */
    function withdraw(uint256 amount) external nonReentrant {
        if (amount == 0) revert InvalidAmount();
        uint256 balance = balances[msg.sender];
        if (balance < amount) revert InsufficientBalance(balance);

        balances[msg.sender] -= amount;

        (bool success, ) = payable(msg.sender).call{value: amount}("");
        if (!success) revert withdrawFail();

        emit Withdraw(msg.sender, amount);
    }

    /**
     * @notice Fetches the balance of a specific address
     * @param addr The address to query
     * @return The balance of the address in wei
     */
    function getBalance(address addr) external view returns (uint256) {
        return balances[addr];
    }

    /**
     * @notice Fetches the total ETH balance held by the contract
     * @return The total contract balance in wei
     */
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
