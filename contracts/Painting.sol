pragma solidity ^0.4.17;

contract Painting {
    address[16] public customers;
    function buy(uint paintingID) public returns (uint) {
        require(paintingID >= 0 && paintingID <= 15);
        customers[paintingID] = msg.sender;
        return paintingID;
    }
    // Retrieving the adopters
    function getCustomers() public view returns (address[16]) {
        return customers;
    }
}