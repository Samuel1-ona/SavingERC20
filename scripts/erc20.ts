import { ethers } from "hardhat";

async function main() {

  const ERC20 = await ethers.deployContract("ERC20"
 );

  await ERC20.waitForDeployment();

  console.log(
    ` deployed to ${ERC20.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});