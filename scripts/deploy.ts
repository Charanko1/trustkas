import hre from "hardhat";

async function main() {
  const { ethers } = hre;

  const Treasury = await ethers.getContractFactory("TrustKasTreasury");
  const treasury = await Treasury.deploy();

  await treasury.waitForDeployment();

  console.log(
    "Contract Address:",
    await treasury.getAddress()
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});