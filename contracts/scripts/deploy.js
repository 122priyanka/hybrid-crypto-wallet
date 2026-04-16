const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const HybridVault = await ethers.getContractFactory("HybridVault");
  const hybridVault = await HybridVault.deploy();
  await hybridVault.waitForDeployment();

  const address = await hybridVault.getAddress();
  console.log(`HybridVault deployed to: ${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
