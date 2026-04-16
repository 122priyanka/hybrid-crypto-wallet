const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HybridVault", function () {
  let HybridVault;
  let hybridVaultContract;
  let owner;
  let addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    HybridVault = await ethers.getContractFactory("HybridVault");
    hybridVaultContract = await HybridVault.deploy();
  });

  describe("Deposit", function () {
    it("User should deposit ETH and emit Deposit event", async function () {
      const amount = ethers.parseEther("1");
      await expect(hybridVaultContract.deposit({ value: amount }))
        .to.emit(hybridVaultContract, "Deposit")
        .withArgs(owner.address, amount);

      expect(await hybridVaultContract.getBalance(owner.address)).to.equal(amount);
    });

    it("Should revert if deposit amount is 0", async function () {
      await expect(hybridVaultContract.deposit({ value: 0 }))
        .to.be.revertedWithCustomError(hybridVaultContract, "InvalidAmount");
    });

    it("Should accept direct ETH transfers", async function () {
      const amount = ethers.parseEther("0.5");
      await expect(owner.sendTransaction({ to: await hybridVaultContract.getAddress(), value: amount }))
        .to.emit(hybridVaultContract, "Deposit")
        .withArgs(owner.address, amount);

      expect(await hybridVaultContract.getBalance(owner.address)).to.equal(amount);
    });
  });

  describe("Withdraw", function () {
    beforeEach(async function () {
      await hybridVaultContract.deposit({ value: ethers.parseEther("1") });
    });

    it("User should withdraw ETH and emit Withdraw event", async function () {
      const amount = ethers.parseEther("0.4");
      const initialBalance = await hybridVaultContract.getBalance(owner.address);

      await expect(hybridVaultContract.withdraw(amount))
        .to.emit(hybridVaultContract, "Withdraw")
        .withArgs(owner.address, amount);

      expect(await hybridVaultContract.getBalance(owner.address)).to.equal(initialBalance - amount);
    });

    it("Should revert if withdrawing more than balance", async function () {
      const balance = await hybridVaultContract.getBalance(owner.address);
      const amount = balance + 1n;
      await expect(hybridVaultContract.withdraw(amount))
        .to.be.revertedWithCustomError(hybridVaultContract, "InsufficientBalance")
        .withArgs(balance);
    });

    it("Should revert if withdrawing 0 amount", async function () {
      await expect(hybridVaultContract.withdraw(0))
        .to.be.revertedWithCustomError(hybridVaultContract, "InvalidAmount");
    });
  });

  describe("Balance tracking", function () {
    it("Should track separate balances for different users", async function () {
      const amount1 = ethers.parseEther("1");
      const amount2 = ethers.parseEther("2");

      await hybridVaultContract.deposit({ value: amount1 });
      await hybridVaultContract.connect(addr1).deposit({ value: amount2 });

      expect(await hybridVaultContract.getBalance(owner.address)).to.equal(amount1);
      expect(await hybridVaultContract.getBalance(addr1.address)).to.equal(amount2);
      expect(await hybridVaultContract.getContractBalance()).to.equal(amount1 + amount2);
    });
  });
});
