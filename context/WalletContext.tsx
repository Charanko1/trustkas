"use client";

import {
  createContext,
  useContext,
  useEffect,
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

export function WalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [address, setAddress] = useState("");

  // Ambil wallet dari database saat aplikasi dibuka
  useEffect(() => {
    loadWallet();
  }, []);

  async function loadWallet() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) return;

      const user = await res.json();

      if (user.walletAddress) {
        setAddress(user.walletAddress);
      }
    } catch (err) {
      console.error(err);
    }
  }

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

  async function connectWallet() {
    if (!window.ethereum) {
      alert("Please install MetaMask");
      return;
    }

    try {
      await switchToBOT();

      const provider = new BrowserProvider(window.ethereum);

      const accounts = await provider.send(
        "eth_requestAccounts",
        []
      );

      const walletAddress = accounts[0];

      // Update Header langsung
      setAddress(walletAddress);

      // Simpan ke MongoDB
      const token = localStorage.getItem("token");

      const res = await fetch("/api/profile", {
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
    } catch (err) {
      console.error(err);
      alert("Failed to connect wallet");
    }
  }

  return (
    <WalletContext.Provider
      value={{ address, connectWallet }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);