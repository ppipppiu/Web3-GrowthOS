// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;


contract GrowthAnalysis {


    event AnalysisUploaded(
        address user,
        string fileName
    );


    function uploadAnalysis(
        string memory fileName
    )
    public payable {


        require(
            msg.value > 0,
            "Need gas payment"
        );


        emit AnalysisUploaded(
            msg.sender,
            fileName
        );

    }

}