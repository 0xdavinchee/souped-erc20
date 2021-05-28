import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Souped } from "../utils/constants";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts } = hre;
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;

  await deploy(Souped.Name, {
    from: deployer,
    args: [Souped.Name, Souped.Symbol, Souped.Supply, Souped.CappedSupply],
    log: true,
  });
};

export default func;
func.tags = [Souped.Name];
