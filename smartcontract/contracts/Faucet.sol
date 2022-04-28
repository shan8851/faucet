// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

contract Faucet {
    uint256 public totalFaucetFunds;
    uint256 public payoutAmount;
    uint256 public totalDonators;
    uint256 public totalPayouts;

    struct Donator {
        uint256 amountRequested;
        uint256 amountDeposited;
        bool hasDonated;
    }

    //mapping user address to user(donator) struct
    mapping(address => Donator) public donators;

    //deopist event
    event Deposited(
        address indexed userAddress,
        uint256 weiAmount,
        uint256 thisTotal,
        uint256 totalDonators
    );

    //requested event
    event EthSent(
        address indexed userAddress,
        uint256 weiAmount,
        uint256 thisTotal,
        uint256 totalPayouts
    );

    //contract owner
    address public owner;

    constructor() payable {
        totalFaucetFunds = 0;
        payoutAmount = 50000000000000000; //0.05 ETH
        owner = msg.sender;
        totalDonators = 0;
        totalPayouts = 0;
    }

    function deposit() public payable {
         if (donators[msg.sender].hasDonated == false) {
            totalDonators = totalDonators + 1;
            donators[msg.sender].hasDonated = true;
        }
        emit Deposited(msg.sender, msg.value, address(this).balance, totalDonators);
        totalFaucetFunds = address(this).balance;
    }

    function setPayoutAmt(uint256 payoutInWei) public {
        require(msg.sender == owner);
        payoutAmount = payoutInWei;
    }

    function sendEth(address payable userAddress) public {
        (bool sent, ) = userAddress.call{value: payoutAmount}("");
        require(sent, "Failed to send Ether");
        totalPayouts = totalPayouts + 1;
        emit EthSent(userAddress, payoutAmount, address(this).balance, totalPayouts);
        totalFaucetFunds = address(this).balance;
    }

    function getTotalDonators() public view returns (uint256) {
        return totalDonators;
    }

    function getTotalPayouts() public view returns (uint256) {
        return totalPayouts;
    }

    function getTotalFaucetFunds() public view returns (uint256) {
        return totalFaucetFunds;
    }
    function withdrawEth()public{
        require(msg.sender == owner);
        (bool sent, ) = owner.call{value: totalFaucetFunds}("");
        require(sent, "Failed to send Ether");
        totalFaucetFunds = address(this).balance;
    }

}
