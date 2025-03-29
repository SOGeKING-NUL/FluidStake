"use client";

import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http, createConfig } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { useEffect } from "react";
import { useAccount } from "wagmi";
import { useWalletStore } from "@/lib/store";

// Create wagmi config with http transport instead of publicProvider
const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

// Create a client for TanStack Query
const queryClient = new QueryClient();

// Component to sync wallet state
function WalletSync() {
  const { address, isConnected } = useAccount();
  const { setConnectedWallet, disconnectWallet } = useWalletStore();
  
  useEffect(() => {
    // Update the global store with connected wallet info
    if (isConnected && address) {
      setConnectedWallet(address, 'metamask');
    } else if (!isConnected) {
      disconnectWallet();
    }
  }, [address, isConnected, setConnectedWallet, disconnectWallet]);
  
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <WalletSync />
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
