# souped-erc20

**Goals of project**

- Create an ERC20 that uses the OpenZeppelin ERC20 standards as well as the extensions.
- Create a subgraph for the token.
- Add tests that ensure the base token and extension functionalities work.

**Token Notes**

- The numbers returned from the smart contract are always 18 decimal numbers which requrie formatting for easier comparison, one very simple conversion is: `Number(ethers.utils.formatUnits(number, decimals))` or `Number(ethers.utils.formatEther(number))`.
- When calling `transferFrom(sender, recepient, amount)`, you must call transferFrom from the `recipient`'s address.

**The Graph Notes**
- The Graph Docs' Quick Start goes through a quick guide using `ganache-cli`, but this project is a hardhat project so a few changes were needed to be made. Since we want our node to be accessible from within Docker, we must bind to `0.0.0.0` rather than the default `127.0.0.1` using `yarn hardhat node --host-name 0.0.0.0`, which can only be accessed from the host machine that Ganache runs on.

**Resources Used**
- https://docs.openzeppelin.com/contracts/4.x/api/token/erc20
- https://thegraph.com/docs/quick-start 