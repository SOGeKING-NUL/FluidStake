import { create } from "zustand"
import { persist } from "zustand/middleware"

interface WalletState {
  activeWallet: Wallet | null
  wallets: Wallet[]
  setActiveWallet: (address: string) => void
  addWallet: (wallet: Wallet) => void
  removeWallet: (address: string) => void
  updateWallet: (address: string, updates: Partial<Wallet>) => void
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
      activeWallet: null,
      wallets: [],
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
    }),
    {
      name: "wallet-storage",
      partialize: (state) => ({
        wallets: state.wallets,
        activeWallet: state.activeWallet,
      }),
    },
  ),
)

