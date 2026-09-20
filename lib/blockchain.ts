"use client";

import { BrowserProvider, Contract } from "ethers";
import abi from "@/lib/abi/TrustKasTreasury.json";

export const CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;

export async function getProvider() {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }

  const provider = new BrowserProvider(window.ethereum);

  await provider.send("eth_requestAccounts", []);

  return provider;
}

export async function getSigner() {
  const provider = await getProvider();
  return await provider.getSigner();
}

export async function getWalletAddress() {
  const signer = await getSigner();
  return await signer.getAddress();
}

export async function getContract() {
  const signer = await getSigner();

  return new Contract(
    CONTRACT_ADDRESS,
    abi,
    signer
  );
}