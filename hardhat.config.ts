import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.20",

  networks: {
    bot: {
      url: process.env.BOT_RPC!,
      accounts: [process.env.PRIVATE_KEY!],
      chainId: 968,
    },
  },
};

export default config;