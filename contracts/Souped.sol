//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Snapshot.sol";

contract Souped is
    ERC20,
    ERC20Capped,
    ERC20Pausable,
    ERC20Snapshot,
    ERC20Burnable
{
    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _amount,
        uint256 _cappedAmount
    ) ERC20Capped(_cappedAmount * 10**uint256(decimals())) ERC20(_name, _symbol) {
        ERC20._mint(msg.sender, _amount * 10**uint256(decimals()));
    }

    function _mint(address _account, uint256 amount)
        internal
        virtual
        override(ERC20, ERC20Capped)
    {
        super._mint(_account, amount);
    }

    function _beforeTokenTransfer(
        address _from,
        address _to,
        uint256 _amount
    ) internal virtual override(ERC20, ERC20Pausable, ERC20Snapshot) {
        super._beforeTokenTransfer(_from, _to, _amount);
    }
}
