"use client";

<<<<<<< HEAD
import { BrowserProvider, Contract, JsonRpcSigner } from "ethers";
import ABI from "@/lib/abi/TrustKasTreasury.json";

export const CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;

const BOT_CHAIN = {
  chainId: "0x3C8",
=======
import { BrowserProvider, Contract, JsonRpcProvider, JsonRpcSigner } from "ethers";
import ABI from "@/lib/abi/TrustKasTreasury.json";

export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";
export const BOT_CHAIN_ID = "0x3C8";
export const BOT_RPC_URL = "https://rpc.bohr.life";
export const BOT_EXPLORER_URL = "https://scan.bohr.life";

const BOT_CHAIN = {
  chainId: BOT_CHAIN_ID,
>>>>>>> master
  chainName: "BOT Chain Testnet",
  nativeCurrency: {
    name: "BOT",
    symbol: "BOT",
    decimals: 18,
  },
<<<<<<< HEAD
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

=======
  rpcUrls: [BOT_RPC_URL],
  blockExplorerUrls: [BOT_EXPLORER_URL],
};

let provider: BrowserProvider | null = null;
let signer: JsonRpcSigner | null = null;
let contract: Contract | null = null;
let readProvider: JsonRpcProvider | null = null;
let readContract: Contract | null = null;


function assertContractAddress() {
  if (!CONTRACT_ADDRESS) {
    throw new Error("NEXT_PUBLIC_CONTRACT_ADDRESS is not configured.");
  }
}

async function ensureChain() {
  const current = await window.ethereum.request({ method: "eth_chainId" });
>>>>>>> master
  if (current === BOT_CHAIN.chainId) return;

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: BOT_CHAIN.chainId }],
    });
<<<<<<< HEAD
  } catch (error: any) {
    if (error.code === 4902) {
=======
  } catch (error: unknown) {
    if ((error as { code?: number }).code === 4902) {
>>>>>>> master
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [BOT_CHAIN],
      });
<<<<<<< HEAD
    } else {
      throw error;
    }
=======
      return;
    }

    throw error;
>>>>>>> master
  }
}

export async function getProvider() {
  if (!window.ethereum) {
<<<<<<< HEAD
    throw new Error("Please install MetaMask");
  }

  if (provider) return provider;

  await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  await ensureChain();

  provider = new BrowserProvider(window.ethereum);

=======
    throw new Error("Please install MetaMask.");
  }

  await ensureChain();

  if (provider) return provider;

  await window.ethereum.request({ method: "eth_requestAccounts" });
  provider = new BrowserProvider(window.ethereum);
>>>>>>> master
  return provider;
}

export async function getSigner() {
<<<<<<< HEAD
  if (signer) return signer;

  const p = await getProvider();
  signer = await p.getSigner();
=======
  const p = await getProvider();
  const accounts = (await window.ethereum.request({
    method: "eth_accounts",
  })) as string[];

  if (!accounts[0]) {
    signer = null;
    throw new Error("Connect a MetaMask wallet first.");
  }

  const nextSigner = await p.getSigner();
  const nextAddress = (await nextSigner.getAddress()).toLowerCase();
  const cachedAddress = signer ? (await signer.getAddress()).toLowerCase() : "";

  if (!signer || cachedAddress !== nextAddress) {
    signer = nextSigner;
  }
>>>>>>> master

  return signer;
}

export async function getWalletAddress() {
  const s = await getSigner();
  return s.getAddress();
}

export async function getContract() {
<<<<<<< HEAD
  if (contract) return contract;

  const s = await getSigner();

  contract = new Contract(CONTRACT_ADDRESS, ABI, s);

  return contract;
}

=======
  assertContractAddress();

  const s = await getSigner();
  contract = new Contract(CONTRACT_ADDRESS, ABI, s);
  return contract;
}

export async function getContractAdmin() {
  assertContractAddress();

  // Reading admin status never needs MetaMask permissions or network switching.
  const provider = getReadProvider();
  const contract = new Contract(CONTRACT_ADDRESS, ABI, provider);
  return (await contract.admin()) as string;
}

export async function isContractAdmin(address?: string) {
  const wallet = address || (await getWalletAddress());
  const admin = await getContractAdmin();
  return admin.toLowerCase() === wallet.toLowerCase();
}

export function getReadProvider() {
  if (readProvider) return readProvider;

  readProvider = new JsonRpcProvider(BOT_RPC_URL, {
    name: "bot-chain-testnet",
    chainId: 968,
  }, { staticNetwork: true });

  return readProvider;
}

export function getReadContract() {
  assertContractAddress();

  if (!readContract || readContract.target !== CONTRACT_ADDRESS) {
    readContract = new Contract(CONTRACT_ADDRESS, ABI, getReadProvider());
  }

  return readContract;
}

export async function getTreasuryBalance() {
  const readContract = getReadContract();
  return readContract.getBalance();
}

export async function getCampaignOnChain(proposalId: string) {
  assertContractAddress();

  // Read-only campaign data should not require a connected wallet.
  const provider = getReadProvider();
  const contract = new Contract(CONTRACT_ADDRESS, ABI, provider);
  return contract.getCampaign(proposalId);
}

export function getExplorerTxUrl(txHash: string) {
  return `${BOT_EXPLORER_URL}/tx/${txHash}`;
}

>>>>>>> master
export function resetBlockchainCache() {
  provider = null;
  signer = null;
  contract = null;
<<<<<<< HEAD
}
=======
  readContract = null;
  readProvider = null;
}
>>>>>>> master
