"use client";

import {
  createContext,
  useContext,
  useState,
} from "react";
import { BrowserProvider } from "ethers";

interface WalletContextType {
  address: string;
  connectWallet: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType>({
  address: "",
  connectWallet: async () => {},
});

// ===============================
// BOT Chain Testnet Config
// ===============================
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

export function WalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [address, setAddress] = useState("");

  // ===============================
  // Switch otomatis ke BOT Chain
  // ===============================
  async function switchToBOT() {
    const chainId = await window.ethereum.request({
      method: "eth_chainId",
    });

    if (chainId === BOT_CHAIN.chainId) return;

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

  // ===============================
  // Connect Wallet
  // ===============================
  async function connectWallet() {
    if (!window.ethereum) {
      alert("Please install MetaMask");
      return;
    }

    try {
      // 1. Switch ke BOT Chain
      await switchToBOT();

      // 2. Connect MetaMask
      const provider = new BrowserProvider(window.ethereum);

      const accounts = await provider.send(
        "eth_requestAccounts",
        []
      );

      const walletAddress = accounts[0];

      // 3. Simpan ke Context
      setAddress(walletAddress);

      // 4. Update MongoDB
      const token = localStorage.getItem("token");

      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          walletAddress,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save wallet");
      }

      const updatedUser = await res.json();

      // 5. Update localStorage
      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );
    } catch (error) {
      console.error(error);
      alert("Failed to connect BOT Chain");
    }
  }

  return (
    <WalletContext.Provider
      value={{
        address,
        connectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () =>
  useContext(WalletContext);