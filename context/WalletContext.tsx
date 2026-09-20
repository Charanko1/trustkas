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

export function WalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [address, setAddress] = useState("");

  // Switch ke Polygon Amoy
  async function switchToPolygon() {
    const chainId = await window.ethereum.request({
      method: "eth_chainId",
    });

    // Polygon Amoy = 80002 = 0x13882
    if (chainId === "0x13882") return;

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x13882" }],
      });
    } catch {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x13882",
            chainName: "Polygon Amoy",
            nativeCurrency: {
              name: "POL",
              symbol: "POL",
              decimals: 18,
            },
            rpcUrls: [
              "https://rpc-amoy.polygon.technology",
            ],
            blockExplorerUrls: [
              "https://amoy.polygonscan.com",
            ],
          },
        ],
      });
    }
  }

  async function connectWallet() {
    if (!window.ethereum) {
      alert("Please install MetaMask");
      return;
    }

    // 1. Pastikan jaringan Polygon Amoy
    await switchToPolygon();

    // 2. Connect wallet
    const provider = new BrowserProvider(window.ethereum);

    const accounts = await provider.send(
      "eth_requestAccounts",
      []
    );

    // 3. Simpan address
    setAddress(accounts[0]);
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