"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useWalletStore, type Wallet } from "@/lib/store"
import { useRouter } from "next/navigation"
import { Copy, Eye, EyeOff, Plus, Trash2, WalletIcon } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import CreateWalletDialog from "@/components/create-wallet-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { motion } from "framer-motion"

export default function WalletsPage() {
  const { wallets, removeWallet, setActiveWallet, activeWallet } = useWalletStore()
  const router = useRouter()
  const { toast } = useToast()
  const [showCreateWallet, setShowCreateWallet] = useState(false)
  const [showPrivateKey, setShowPrivateKey] = useState<Record<string, boolean>>({})
  const [walletToDelete, setWalletToDelete] = useState<string | null>(null)

  const togglePrivateKey = (address: string) => {
    setShowPrivateKey((prev) => ({
      ...prev,
      [address]: !prev[address],
    }))
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    })
  }

  const handleDeleteWallet = (address: string) => {
    setWalletToDelete(address)
  }

  const confirmDeleteWallet = () => {
    if (walletToDelete) {
      removeWallet(walletToDelete)
      toast({
        title: "Wallet deleted",
        description: "The wallet has been removed from your list",
      })
      setWalletToDelete(null)
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="container max-w-6xl py-6 md:py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight gradient-text">My Wallets</h1>
          <p className="text-muted-foreground">Manage your created wallets and private keys</p>
        </div>
        <Button
          onClick={() => setShowCreateWallet(true)}
          className="bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Wallet
        </Button>
      </div>

      {wallets.length === 0 ? (
        <Card className="border-dashed glass-card">
          <CardContent className="flex flex-col items-center justify-center py-10">
            <WalletIcon className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No wallets created yet</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
              Create your first wallet to start managing your crypto assets securely
            </p>
            <Button
              onClick={() => setShowCreateWallet(true)}
              className="bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Wallet
            </Button>
          </CardContent>
        </Card>
      ) : (
        <motion.div className="grid gap-6 md:grid-cols-2" variants={container} initial="hidden" animate="show">
          {wallets.map((wallet: Wallet) => (
            <motion.div key={wallet.address} variants={item}>
              <Card
                className={`overflow-hidden glass-card ${activeWallet?.address === wallet.address ? "ring-1 ring-primary" : ""}`}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{wallet.name || "Unnamed Wallet"}</CardTitle>
                      <CardDescription className="font-mono text-xs truncate mt-1">{wallet.address}</CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteWallet(wallet.address)}
                      className="hover:bg-white/10 dark:hover:bg-black/10"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium">Private Key</div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-white/10 dark:hover:bg-black/10"
                          onClick={() => togglePrivateKey(wallet.address)}
                        >
                          {showPrivateKey[wallet.address] ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-white/10 dark:hover:bg-black/10"
                          onClick={() => copyToClipboard(wallet.privateKey, "Private Key")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-2 border rounded-md bg-white/20 dark:bg-black/20 font-mono text-xs break-all">
                      {showPrivateKey[wallet.address]
                        ? wallet.privateKey
                        : "••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••"}
                    </div>
                  </div>

                  {wallet.mnemonic && (
                    <div className="space-y-2 mt-4">
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-medium">Mnemonic Phrase</div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-white/10 dark:hover:bg-black/10"
                          onClick={() => copyToClipboard(wallet.mnemonic!, "Mnemonic")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="p-2 border rounded-md bg-white/20 dark:bg-black/20 font-mono text-xs break-all">
                        {wallet.mnemonic}
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="pt-2 flex gap-2">
                  {activeWallet?.address !== wallet.address && (
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
                      onClick={() => {
                        setActiveWallet(wallet.address)
                        toast({
                          title: "Wallet activated",
                          description: "This wallet is now your active wallet",
                        })
                      }}
                    >
                      Use This Wallet
                    </Button>
                  )}
                  <Button
                    variant={activeWallet?.address === wallet.address ? "default" : "outline"}
                    size="sm"
                    className={`${activeWallet?.address === wallet.address ? "bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90" : "border-black/20 dark:border-white/20"} ${activeWallet?.address === wallet.address ? "w-full" : "w-1/2"}`}
                    onClick={() => router.push(`/wallets/${wallet.address}`)}
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {showCreateWallet && <CreateWalletDialog open={showCreateWallet} onOpenChange={setShowCreateWallet} />}

      <AlertDialog open={!!walletToDelete} onOpenChange={(open) => !open && setWalletToDelete(null)}>
        <AlertDialogContent className="bg-white/80 dark:bg-black/80 backdrop-blur-md border-white/20 dark:border-black/20">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the wallet from your list. Make sure you have
              backed up the private key if you need it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-black/20 dark:border-white/20">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteWallet} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

