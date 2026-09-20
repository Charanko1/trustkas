import type { Metadata } from "next";
import { Geist } from "next/font/google";

import "./globals.css";
import MainSidebar from "@/components/layout/MainSidebar";
import Header from "@/components/layout/Header";
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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-zinc-100 antialiased`}>
        <WalletProvider>
          <div className="flex min-h-screen">
            <MainSidebar />

            <main className="flex-1">
              <Header />

              <div className="p-8">{children}</div>
            </main>
          </div>
        </WalletProvider>
      </body>
    </html>
  );
}