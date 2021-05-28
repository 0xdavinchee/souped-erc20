# souped-erc20

**Goals of project**

- Create an ERC20 that uses the OpenZeppelin ERC20 standards as well as the extensions.
- Create a subgraph for the token.
- Add tests that ensure the base token and extension functionalities work.

**Notes**

- The numbers returned from the smart contract are always 18 decimal numbers which requrie formatting for easier comparison, one very simple conversion is: `Number(ethers.utils.formatUnits(number, decimals))` or `Number(ethers.utils.formatEther(number))`.
- When calling `transferFrom(sender, recepient, amount)`, you must call transferFrom from the `recipient`'s address.
