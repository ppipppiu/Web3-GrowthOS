import { network } from "hardhat";

async function main() {
  const { ethers } = await network.connect();

  const GrowthReport = await ethers.getContractFactory("GrowthReport");

  const contract = await GrowthReport.deploy();

  await contract.waitForDeployment();

  console.log("GrowthReport deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);

  process.exitCode = 1;
});
