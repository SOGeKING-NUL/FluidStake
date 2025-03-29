"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useWalletStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, ExternalLink, RefreshCw } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { transferEth } from "@/lib/ethereum"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import CreateWalletDialog from "@/components/create-wallet-dialog"
import { motion } from "framer-motion"

export default function TransferEthPage() {
  const { activeWallet, wallets } = useWalletStore()
  const router = useRouter()
  const { toast } = useToast()
  const [selectedWallet, setSelectedWallet] = useState("")
  const [recipientAddress, setRecipientAddress] = useState("")
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showCreateWallet, setShowCreateWallet] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)

  const handleTransfer = async () => {
    if (!selectedWallet || !recipientAddress || !amount) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    const wallet = wallets.find((w) => w.address === selectedWallet)
    if (!wallet) {
      toast({
        title: "Error",
        description: "Selected wallet not found",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)
      const tx = await transferEth(wallet.privateKey, recipientAddress, amount)
      setTxHash(tx.hash)

      toast({
        title: "Transaction sent",
        description: "Your ETH transfer has been submitted to the network",
      })
    } catch (error) {
      console.error("Error transferring ETH:", error)
      toast({
        title: "Error",
        description: "Failed to transfer ETH. Please check your inputs and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!activeWallet) {
    return (
      <div className="container max-w-6xl py-10">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <ArrowRight className="h-16 w-16 text-muted-foreground mb-4" />
          <h1 className="text-3xl font-bold tracking-tight">Create Your First Wallet</h1>
          <p className="text-muted-foreground mt-2 mb-6 max-w-md">Create a wallet to access transfer features</p>
          <Button
            onClick={() => setShowCreateWallet(true)}
            className="bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
          >
            Create Wallet
          </Button>
          {showCreateWallet && <CreateWalletDialog open={showCreateWallet} onOpenChange={setShowCreateWallet} />}
        </div>
      </div>
    )
  }

  if (wallets.length === 0) {
    return (
      <div className="container max-w-6xl py-10">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <ArrowRight className="h-16 w-16 text-muted-foreground mb-4" />
          <h1 className="text-3xl font-bold tracking-tight">No Wallets Found</h1>
          <p className="text-muted-foreground mt-2 mb-6 max-w-md">You need to create a wallet first to transfer ETH</p>
          <Button
            onClick={() => setShowCreateWallet(true)}
            className="bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
          >
            Create Wallet
          </Button>
          {showCreateWallet && <CreateWalletDialog open={showCreateWallet} onOpenChange={setShowCreateWallet} />}
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-6xl py-6 md:py-10">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div className="flex items-center gap-2 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
            className="border-black/20 dark:border-white/20"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight gradient-text">Transfer ETH</h1>
            <p className="text-muted-foreground">Send ETH to another address</p>
          </div>
        </div>

        <Card className="max-w-md mx-auto glass-card glow">
          <CardHeader>
            <CardTitle>Send ETH</CardTitle>
            <CardDescription>Transfer ETH from one of your wallets to any address</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fromWallet">From Wallet</Label>
                <Select value={selectedWallet || activeWallet.address} onValueChange={setSelectedWallet}>
                  <SelectTrigger id="fromWallet" className="bg-white/20 dark:bg-black/20">
                    <SelectValue placeholder="Select wallet" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/80 dark:bg-black/80 backdrop-blur-md">
                    {wallets.map((wallet) => (
                      <SelectItem key={wallet.address} value={wallet.address}>
                        {wallet.name || wallet.address.substring(0, 10) + "..."}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="toAddress">To Address</Label>
                <Input
                  id="toAddress"
                  placeholder="0x..."
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  className="bg-white/20 dark:bg-black/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (ETH)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.0001"
                  min="0"
                  placeholder="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-white/20 dark:bg-black/20"
                />
              </div>
              <Button
                onClick={handleTransfer}
                disabled={isLoading || !selectedWallet || !recipientAddress || !amount}
                className="w-full bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Send ETH"
                )}
              </Button>

              {txHash && (
                <div className="mt-4 p-4 border rounded-md border-white/10 dark:border-black/10 bg-white/20 dark:bg-black/20">
                  <div className="text-sm font-medium">Transaction Hash</div>
                  <div className="font-mono text-xs break-all mt-1">{txHash}</div>
                  <a
                    href={`https://sepolia.etherscan.io/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-primary text-sm mt-2"
                  >
                    View on Etherscan
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

