// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract BookHashes {
    mapping(string => bool) private hashes;

    function hashExists(string memory hash) public view returns (bool) {
        return hashes[hash];
    }

    function addHash(string memory hash) public {
        require(!hashes[hash], "Hash already exists");
        hashes[hash] = true;
    }
}
