"use client";

import { BrowserProvider, Contract } from "ethers";
import ABI from "@/lib/abi/TrustKasTreasury.json";

export const CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;

// BOT Chain Testnet
const BOT_CHAIN = {
  chainId: "0x3C8", // 968
  chainName: "BOT Chain Testnet",
  nativeCurrency: {
    name: "BOT",
    symbol: "BOT",
    decimals: 18,
  },
  rpcUrls: ["https://rpc.bohr.life"],
  blockExplorerUrls: ["https://scan.bohr.life"],
};

declare global {
  interface Window {
    ethereum: any;
  }
}

export async function getProvider() {
  if (!window.ethereum) {
    throw new Error("Please install MetaMask");
  }

  await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  const currentChain = await window.ethereum.request({
    method: "eth_chainId",
  });

  if (currentChain !== BOT_CHAIN.chainId) {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: BOT_CHAIN.chainId }],
      });
    } catch (error: any) {
      if (error.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [BOT_CHAIN],
        });
      } else {
        throw error;
      }
    }
  }

  return new BrowserProvider(window.ethereum);
}

export async function getSigner() {
  const provider = await getProvider();
  return provider.getSigner();
}

export async function getWalletAddress() {
  const signer = await getSigner();
  return signer.getAddress();
}

export async function getContract() {
  const signer = await getSigner();

  return new Contract(
    CONTRACT_ADDRESS,
    ABI,
    signer
  );
}