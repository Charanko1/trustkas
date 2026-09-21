// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TrustKasTreasury {

    address public admin;

    constructor() {
        admin = msg.sender;
    }

    struct Donation {
        address donor;
        uint256 amount;
        string proposalId;
        uint256 timestamp;
    }

    Donation[] public donations;

    event Donated(
        address indexed donor,
        uint256 amount,
        string proposalId
    );

    event Withdrawn(
        address indexed to,
        uint256 amount
    );

    // =====================================
    // Donate BOT (Native Token)
    // =====================================
    function donate(string memory proposalId)
        external
        payable
    {
        require(
            msg.value > 0,
            "Amount must be greater than 0"
        );

        donations.push(
            Donation({
                donor: msg.sender,
                amount: msg.value,
                proposalId: proposalId,
                timestamp: block.timestamp
            })
        );

        emit Donated(
            msg.sender,
            msg.value,
            proposalId
        );
    }

    // =====================================
    // Withdraw BOT Treasury
    // =====================================
    function withdraw(address payable to)
        external
    {
        require(
            msg.sender == admin,
            "Only admin"
        );

        uint256 balance = address(this).balance;

        require(
            balance > 0,
            "Empty treasury"
        );

        (bool success, ) = to.call{value: balance}("");

        require(
            success,
            "Transfer failed"
        );

        emit Withdrawn(
            to,
            balance
        );
    }

    // =====================================
    // Current Treasury Balance (BOT)
    // =====================================
    function getBalance()
        external
        view
        returns (uint256)
    {
        return address(this).balance;
    }

    // =====================================
    // Total Donations
    // =====================================
    function getDonationCount()
        external
        view
        returns (uint256)
    {
        return donations.length;
    }

    // =====================================
    // Donation Detail
    // =====================================
    function getDonation(uint256 index)
        external
        view
        returns (
            address donor,
            uint256 amount,
            string memory proposalId,
            uint256 timestamp
        )
    {
        Donation memory d = donations[index];

        return (
            d.donor,
            d.amount,
            d.proposalId,
            d.timestamp
        );
    }
}