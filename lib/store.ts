import { create } from "zustand"
import { persist } from "zustand/middleware"
import { ethers } from "ethers"

interface WalletState {
  // Local wallets
  activeWallet: Wallet | null
  wallets: Wallet[]
  
  // Connected external wallet
  connectedAddress: string | null
  connectedWalletType: 'metamask' | 'phantom' | null
  isWalletConnected: boolean
  
  // Actions for local wallets
  setActiveWallet: (address: string) => void
  addWallet: (wallet: Wallet) => void
  removeWallet: (address: string) => void
  updateWallet: (address: string, updates: Partial<Wallet>) => void
  
  // Actions for connected wallets
  setConnectedWallet: (address: string | null, walletType: 'metamask' | 'phantom' | null) => void
  disconnectWallet: () => void
}

export interface Wallet {
  address: string
  privateKey: string
  mnemonic?: string
  name?: string
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      // Local wallets state
      activeWallet: null,
      wallets: [],
      
      // Connected external wallet state
      connectedAddress: null,
      connectedWalletType: null,
      isWalletConnected: false,
      
      // Actions for local wallets
      setActiveWallet: (address) =>
        set((state) => {
          const wallet = state.wallets.find((w) => w.address === address) || null
          return { activeWallet: wallet }
        }),
      addWallet: (wallet) =>
        set((state) => {
          const newWallets = [...state.wallets.filter((w) => w.address !== wallet.address), wallet]
          return {
            wallets: newWallets,
            // If this is the first wallet or no active wallet, set it as active
            activeWallet: state.activeWallet ? state.activeWallet : wallet,
          }
        }),
      removeWallet: (address) =>
        set((state) => {
          const newWallets = state.wallets.filter((w) => w.address !== address)
          return {
            wallets: newWallets,
            // If active wallet is removed, set first available wallet as active or null
            activeWallet:
              state.activeWallet?.address === address
                ? newWallets.length > 0
                  ? newWallets[0]
                  : null
                : state.activeWallet,
          }
        }),
      updateWallet: (address, updates) =>
        set((state) => {
          const newWallets = state.wallets.map((w) => (w.address === address ? { ...w, ...updates } : w))
          return {
            wallets: newWallets,
            // Update active wallet if it's the one being updated
            activeWallet:
              state.activeWallet?.address === address ? { ...state.activeWallet, ...updates } : state.activeWallet,
          }
        }),
      
      // Actions for connected wallets
      setConnectedWallet: (address, walletType) =>
        set(() => ({
          connectedAddress: address,
          connectedWalletType: walletType,
          isWalletConnected: address !== null,
        })),
      disconnectWallet: () =>
        set(() => ({
          connectedAddress: null,
          connectedWalletType: null,
          isWalletConnected: false,
        })),
    }),
    {
      name: "wallet-storage",
      partialize: (state) => ({
        wallets: state.wallets,
        activeWallet: state.activeWallet,
        connectedAddress: state.connectedAddress,
        connectedWalletType: state.connectedWalletType,
        isWalletConnected: state.isWalletConnected,
      }),
    },
  ),
)
