import { expect } from "./chai-setup";
import { Souped } from "../typechain";
import {
  ethers,
  deployments,
  getUnnamedAccounts,
  getNamedAccounts,
} from "hardhat";
import { setupUser, setupUsers } from "./utils";
import { Souped as SoupedObj } from "../utils/constants";
import { BigNumber } from "@ethersproject/bignumber";

const setup = async () => {
  await deployments.fixture([SoupedObj.Name]);
  const contracts = {
    Souped: (await ethers.getContract(SoupedObj.Name)) as Souped,
  };

  const users = await getUnnamedAccounts();
  const { deployer } = await getNamedAccounts();

  return {
    ...contracts,
    deployer: await setupUser(deployer, contracts),
    users: await setupUsers(users, contracts),
  };
};

const getNumber = (bigNum: BigNumber) => {
  return Number(ethers.utils.formatEther(bigNum));
};

describe("Souped", () => {
  describe("Deployment", () => {
    it("Should be initialized properly.", async () => {
      const { Souped } = await setup();
      expect(getNumber(await Souped.totalSupply())).to.equal(SoupedObj.Supply);
      expect(getNumber(await Souped.cap())).to.equal(SoupedObj.CappedSupply);
      expect(await Souped.name()).to.equal(SoupedObj.Name);
      expect(await Souped.symbol()).to.equal(SoupedObj.Symbol);
    });

    it("Should assign the total supply to the contract deployer.", async () => {
      const { deployer, Souped } = await setup();
      expect(await Souped.totalSupply()).to.equal(
        await Souped.balanceOf(deployer.address)
      );
    });
  });

  describe("ERC20", () => {
    it("Should allow simple transfer.", async () => {
      const { deployer, Souped, users } = await setup();
      const SEND_TOKEN_AMOUNT = ethers.utils.parseUnits("100");
      const transferTxn = Souped.transfer(users[0].address, SEND_TOKEN_AMOUNT);
      await transferTxn;
      expect(transferTxn)
        .to.emit(Souped, "Transfer")
        .withArgs(deployer.address, users[0].address, SEND_TOKEN_AMOUNT);
      const user0Balance = getNumber(await Souped.balanceOf(users[0].address));
      const deployerBalance = getNumber(
        await Souped.balanceOf(deployer.address)
      );
      const sendTokenAmount = getNumber(SEND_TOKEN_AMOUNT);
      expect(user0Balance).to.equal(sendTokenAmount);
      expect(deployerBalance).to.equal(SoupedObj.Supply - sendTokenAmount)
    });

    it("Should not allow transfer without approval.", async () => {
      const { deployer, Souped, users } = await setup();
      Souped.approve(users[0].address, 100);
      // expect();
    });

    // it("Should not allow transfer without approval.", async () => {
    //   const { deployer, Souped, users } = await setup();
    //   Souped.approve(users[0].address, 100);
    //   expect();
    // });
  });

  describe("ERC20Burnable", () => {});

  describe("ERC20Capped", () => {});

  describe("ERC20Pausable", () => {});

  describe("ERC20Snapshot", () => {});
});
