import { HardhatUserConfig, task, types } from "hardhat/config";
import "hardhat-deploy";
import "hardhat-deploy-ethers";
import "hardhat-prettier";
import "hardhat-typechain";
import "solidity-coverage";
import { config as dotEnvConfig } from "dotenv";
dotEnvConfig();
import SoupedContract from "./artifacts/contracts/Souped.sol/Souped.json";
import { Souped } from "./typechain";

const CONTRACT_ADDRESS = process.env.DEPLOYED_CONTRACT_ADDRESS || "";

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("send", "sends a specified amount of souped token to specified address")
  .addParam("amount", "amount of tokens you want to send", "0", types.string)
  .addParam("address", "receiver address", "", types.string)
  .setAction(async (args, hre) => {
    const accounts = await hre.ethers.getSigners();
    const souped = (await hre.ethers.getContractAt(
      SoupedContract.abi,
      CONTRACT_ADDRESS,
      accounts[0]
    )) as Souped;
    const txn = await souped.transfer(
      args.address,
      hre.ethers.utils.parseUnits(args.amount)
    );
    const receipt = await txn.wait();
    console.log(receipt);
  });

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const config: HardhatUserConfig = {
  solidity: "0.8.0",
  networks: {
    rinkeby: {
      url: process.env.ETH_NODE_URI_RINKEBY || "",
      accounts: [process.env.PRIVATE_KEY || ""],
    },
  },
  namedAccounts: {
    deployer: 0,
  },
};

export default config;
