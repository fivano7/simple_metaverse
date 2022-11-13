const fs = require('fs');
const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {

  const name = "CROtaverse"
  const symbol = "CRO"
  const cost = ethers.utils.parseEther("1");

  const Land = await ethers.getContractFactory("Land")
  const landInstance = await Land.deploy(name, symbol, cost)

  /////////////////Podaci za frontend///////////////////////
  const contractsDir = __dirname + "/../src/contractsData";
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  const deploymentAddresses = {}
  deploymentAddresses[31337] = { address: landInstance.address }
  deploymentAddresses[5] = { address: "0x192e630760e95faafd7304e66a2789a77d786372" }

  //Spremamo adresu
  fs.writeFileSync(

    contractsDir + `/land-address.json`,
    JSON.stringify(deploymentAddresses, undefined, 2)
  );

  const contractArtifact = artifacts.readArtifactSync("Land");

  //Spremamo ABI
  fs.writeFileSync(
    contractsDir + `/land.json`,
    JSON.stringify(contractArtifact, null, 2)
  );

  console.log("Contract Land deploy with address", landInstance.address)

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
