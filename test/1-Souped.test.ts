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
      expect(deployerBalance).to.equal(SoupedObj.Supply - sendTokenAmount);
    });

    it("Should not allow transferFrom without approval.", async () => {
      const { deployer, Souped, users } = await setup();
      const SEND_TOKEN_AMOUNT = ethers.utils.parseUnits("100");
      expect(
        Souped.transferFrom(
          deployer.address,
          users[0].address,
          SEND_TOKEN_AMOUNT
        )
      ).to.be.revertedWith("ERC20: transfer amount exceeds allowance");
    });

    it("Should allow transferFrom with approval.", async () => {
      const { deployer, Souped, users } = await setup();
      const SEND_TOKEN_AMOUNT = ethers.utils.parseUnits("100");
      const approvalTxn = deployer.Souped.approve(
        users[0].address,
        SEND_TOKEN_AMOUNT
      );
      await approvalTxn;

      expect(approvalTxn)
        .to.emit(Souped, "Approval")
        .withArgs(deployer.address, users[0].address, SEND_TOKEN_AMOUNT);

      expect(
        users[0].Souped.transferFrom(
          deployer.address,
          users[0].address,
          SEND_TOKEN_AMOUNT
        )
      )
        .to.emit(Souped, "Transfer")
        .withArgs(deployer.address, users[0].address, SEND_TOKEN_AMOUNT);

      expect(getNumber(await Souped.balanceOf(users[0].address))).to.equal(
        getNumber(SEND_TOKEN_AMOUNT)
      );
    });

    it("Should be able to increase allowance.", async () => {
      const { deployer, Souped, users } = await setup();
      const SEND_TOKEN_AMOUNT = ethers.utils.parseUnits("100");
      const increaseAllowance = Souped.increaseAllowance(
        users[0].address,
        SEND_TOKEN_AMOUNT
      );
      await increaseAllowance;

      expect(increaseAllowance)
        .to.emit(Souped, "Approval")
        .withArgs(deployer.address, users[0].address, SEND_TOKEN_AMOUNT);

      expect(
        users[0].Souped.transferFrom(
          deployer.address,
          users[0].address,
          SEND_TOKEN_AMOUNT
        )
      )
        .to.emit(Souped, "Transfer")
        .withArgs(deployer.address, users[0].address, SEND_TOKEN_AMOUNT);

      expect(getNumber(await Souped.balanceOf(users[0].address))).to.equal(
        getNumber(SEND_TOKEN_AMOUNT)
      );
    });
  });

  describe("ERC20Burnable", () => {
    it("Should be able to burn tokens", async () => {
      const { deployer, Souped, users } = await setup();
      const BURN_TOKEN_AMOUNT = ethers.utils.parseUnits("100");
      const FINAL_SUPPLY = ethers.utils.parseUnits(
        String(SoupedObj.Supply - 100)
      );
      await expect(Souped.burn(BURN_TOKEN_AMOUNT))
        .to.emit(Souped, "Transfer")
        .withArgs(
          deployer.address,
          ethers.constants.AddressZero,
          BURN_TOKEN_AMOUNT
        );
      expect(await Souped.totalSupply()).to.equal(FINAL_SUPPLY);
    });

    it("Should be able to burnFrom.", async () => {
      const { deployer, Souped, users } = await setup();
      const BURN_TOKEN_AMOUNT = ethers.utils.parseUnits("100");
      const increaseAllowance = Souped.increaseAllowance(
        users[0].address,
        BURN_TOKEN_AMOUNT
      );
      await increaseAllowance;

      expect(increaseAllowance)
        .to.emit(Souped, "Approval")
        .withArgs(deployer.address, users[0].address, BURN_TOKEN_AMOUNT);

      expect(users[0].Souped.burnFrom(deployer.address, BURN_TOKEN_AMOUNT))
        .to.emit(Souped, "Transfer")
        .withArgs(
          deployer.address,
          ethers.constants.AddressZero,
          BURN_TOKEN_AMOUNT
        );
    });
  });

  describe("ERC20Pausable", () => {
    it("Should be paused.", async () => {
      const { Souped } = await setup();
      expect(await Souped.paused()).to.equal(false);
    });
  });

  describe("ERC20Snapshot", () => {});
});
