// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract GrowthReport {

    struct Report {

        address owner;

        string reportHash;

        uint256 timestamp;

    }


    mapping(address => Report[]) private reports;


    event ReportCreated(
        address indexed owner,
        string reportHash,
        uint256 timestamp
    );


    function createReport(
        string memory _hash
    ) public {

        reports[msg.sender].push(
            Report(
                msg.sender,
                _hash,
                block.timestamp
            )
        );


        emit ReportCreated(
            msg.sender,
            _hash,
            block.timestamp
        );
    }


    function getMyReports()
        public
        view
        returns(Report[] memory)
    {

        return reports[msg.sender];

    }

}