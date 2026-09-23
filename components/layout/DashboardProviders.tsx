"use client";

import { useState, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WalletProvider } from "@/context/WalletContext";
import { ApiError } from "@/lib/api-client";
import { getToken } from "@/lib/session";

export default function DashboardProviders({ children }: { children: ReactNode }) {
  const router = useRouter();
  // A new cache per dashboard mount; private data is not shared across logins.
  const [client] = useState(() => new QueryClient({ defaultOptions: { queries: {
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    retry: (count, error) => !(error instanceof ApiError && error.status < 500) && count < 1,
  } } }));
  useEffect(() => { if (!getToken()) router.replace("/login"); }, [router]);
  return <QueryClientProvider client={client}><WalletProvider>{children}</WalletProvider></QueryClientProvider>;
}
