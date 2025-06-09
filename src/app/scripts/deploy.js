const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Desplegando contrato con la cuenta:", deployer.address);

  const ContractFactory = await ethers.getContractFactory("MyERC1155");
  const contrato = await ContractFactory.deploy();

  await contrato.deployed();

  console.log("Contrato desplegado en:", contrato.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
