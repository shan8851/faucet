const { ethers } = require("hardhat");

async function main() {
  console.log("✅ Deploying contract...");
  const faucetContract = await ethers.getContractFactory("Faucet");
  // here we deploy the contract
  const deployedFaucetContract = await faucetContract.deploy({
    value: ethers.utils.parseEther("0.1"),
  });
  // Wait for it to finish deploying
  await deployedFaucetContract.deployed();
  // print the address of the deployed contract
  console.log("Faucet Contract Address:", deployedFaucetContract.address);
}

// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
