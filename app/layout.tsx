import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "@/context/WalletContext";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TrustKas",
  description: "Blockchain Organization Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-zinc-100 antialiased`}>
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}