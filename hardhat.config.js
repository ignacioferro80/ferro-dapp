require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  paths: {
    sources: "./src/app/contracts",
    scripts: "./src/app/scripts",
    artifacts: "./artifacts"
  },
  networks: {
    sepolia: {
      url: process.env.ALCHEMY_API_URL,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
  },
};
