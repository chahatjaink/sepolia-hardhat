// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Contract {
    uint x;

    function changeX(uint _x) public {
        x = _x;
        // console.log("x is now", x);
    }
    
}
