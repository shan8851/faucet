const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FaucetBalanceAfterUpdate", function () {
  it("Should return the balance in the faucet after a donation", async function () {
    const Faucet = await ethers.getContractFactory("Faucet");
    const faucetContract = await Faucet.deploy();
    await faucetContract.deployed();

    // Simulate donation of 1ETH
    const donationAmount = "1";
    await faucetContract.deposit({
      value: ethers.utils.parseUnits(donationAmount, "ether"),
    });

    // Check faucet balance
    const funds = ethers.utils.formatUnits(
      await faucetContract.getTotalFaucetFunds(),
      0
    );
    expect(funds).to.equal("1000000000000000000");
  });
});
