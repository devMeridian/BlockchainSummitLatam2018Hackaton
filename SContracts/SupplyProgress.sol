pragma solidity ^0.4.24;

import "sai/tub.sol";
import "ds-math/math.sol";
import "ds-value/value.sol";

contract SupplyProgress is DSMath {


    uint256 public collateral;
    uint256 public debt;
    uint256 public price;
    uint256 public totalValue;
    uint256 public fee;
    uint256 public surplus;

    DSToken constant dai = DSToken(0xC4375B7De8af5a38a93548eb8453a498222C4fF2);

    event Owner();
    event RetrievedData(uint collateral, uint debt, uint price);
    event Calculated(uint totalValue, uint fee, uint surplus);
    event Shut();
    event Transfered();
    event Funded(address _address, uint amount, uint total);
    event Paid(address _address, uint amount);


    event SupplyProgressUpdated(bool successful);

    constructor() public {}

    function setSucceeded(bool successful) public {
        require(dai.transfer(msg.sender, 1));
        emit SupplyProgressUpdated(successful);
    }


    function fund(uint amount) public {
        require(amount > 0);
        require(dai.transferFrom(msg.sender, address(this), amount));
    }

}