// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Faucet {
  address payable public owner;

  constructor() payable {
    owner = payable(msg.sender);
  }

  function withdraw(uint _amount) public {
    // users can only withdraw .1 ETH at a time, feel free to change this!
    require(_amount <= 1000000000000000, "Faucet: Withdraw amount exceeds the limit");
    
    (bool sent, ) = payable(msg.sender).call{value: _amount}("");
    require(sent, "Faucet: Failed to send Ether");
  }

  function withdrawAll() public onlyOwner {
    (bool sent, ) = owner.call{value: address(this).balance}("");
    require(sent, "Faucet: Failed to send Ether");
  }

  modifier onlyOwner() {
    require(msg.sender == owner, "Faucet: Caller is not the owner");
    _;
  }
}
