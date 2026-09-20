// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TrustKasTreasury {

    address public admin;

    constructor() {
        admin = msg.sender;
    }

    struct Donation {
        address donor;
        uint amount;
        string proposalId;
        uint timestamp;
    }

    Donation[] public donations;

    event Donated(
        address indexed donor,
        uint amount,
        string proposalId
    );

    function donate(string memory proposalId)
        external
        payable
    {
        require(msg.value > 0, "Amount must be > 0");

        donations.push(
            Donation(
                msg.sender,
                msg.value,
                proposalId,
                block.timestamp
            )
        );

        emit Donated(
            msg.sender,
            msg.value,
            proposalId
        );
    }

    function withdraw(address payable to)
        external
    {
        require(msg.sender == admin);

        to.transfer(address(this).balance);
    }

    function getDonationCount()
        external
        view
        returns(uint)
    {
        return donations.length;
    }

    function getBalance()
        external
        view
        returns(uint)
    {
        return address(this).balance;
    }
}