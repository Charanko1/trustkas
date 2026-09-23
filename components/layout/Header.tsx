"use client";
import { Wallet } from "lucide-react";
import { usePathname } from "next/navigation";
import { useWallet } from "@/context/WalletContext";
import styles from "./DashboardShell.module.css";

export default function Header() {
  const pathname = usePathname();
  const { address, connectWallet, connecting, error } = useWallet();
  const section = pathname === "/history" ? "Activity history" : pathname === "/profile" ? "Your profile" : pathname.includes("/proposal/") ? "Funding proposal" : pathname.includes("/groups/") ? "Your group" : pathname.startsWith("/organization/") ? "Your organization" : "Your community";
  return <header className={styles.header}>
    <div><p className={styles.headerLabel}>YOUR LITTLE CORNER OF GOOD</p><p className={styles.headerTitle}>{section}</p></div>
    <div className={styles.walletArea}>
      <span className={styles.network}>BOT CHAIN TESTNET</span>
      {address ? <span className={styles.walletConnected} title={address}><Wallet size={18} aria-hidden="true" />{address.slice(0, 6)}…{address.slice(-4)}</span> : <button className="pledgr-button" onClick={() => void connectWallet()} disabled={connecting}><Wallet size={18} aria-hidden="true" />{connecting ? "Connecting…" : "Connect wallet"}</button>}
      {error && <p className={styles.walletError} role="alert">{error}</p>}
    </div>
  </header>;
}
