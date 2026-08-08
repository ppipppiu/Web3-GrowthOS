import "dotenv/config";
import hardhatEthers from "@nomicfoundation/hardhat-ethers";
import { defineConfig } from "hardhat/config";

export default defineConfig({
  plugins: [hardhatEthers],

  solidity: {
    version: "0.8.20",
  },

  networks: {
    monadTestnet: {
      type: "http",
      url: "https://testnet-rpc.monad.xyz",

      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
});
