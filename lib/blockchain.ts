"use client";

import { BrowserProvider, Contract, JsonRpcSigner } from "ethers";
import ABI from "@/lib/abi/TrustKasTreasury.json";

export const CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;

const BOT_CHAIN = {
  chainId: "0x3C8",
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

let provider: BrowserProvider | null = null;
let signer: JsonRpcSigner | null = null;
let contract: Contract | null = null;

async function ensureChain() {
  const current = await window.ethereum.request({
    method: "eth_chainId",
  });

  if (current === BOT_CHAIN.chainId) return;

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

export async function getProvider() {
  if (!window.ethereum) {
    throw new Error("Please install MetaMask");
  }

  if (provider) return provider;

  await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  await ensureChain();

  provider = new BrowserProvider(window.ethereum);

  return provider;
}

export async function getSigner() {
  if (signer) return signer;

  const p = await getProvider();
  signer = await p.getSigner();

  return signer;
}

export async function getWalletAddress() {
  const s = await getSigner();
  return s.getAddress();
}

export async function getContract() {
  if (contract) return contract;

  const s = await getSigner();

  contract = new Contract(CONTRACT_ADDRESS, ABI, s);

  return contract;
}

export function resetBlockchainCache() {
  provider = null;
  signer = null;
  contract = null;
}