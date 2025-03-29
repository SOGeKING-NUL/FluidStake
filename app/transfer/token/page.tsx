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
import { transferToken } from "@/lib/ethereum"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function TransferTokenPage() {
  const { address, wallets } = useWalletStore()
  const router = useRouter()
  const { toast } = useToast()
  const [selectedWallet, setSelectedWallet] = useState("")
  const [tokenAddress, setTokenAddress] = useState("")
  const [recipientAddress, setRecipientAddress] = useState("")
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)

  const handleTransfer = async () => {
    if (!selectedWallet || !tokenAddress || !recipientAddress || !amount) {
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
      const tx = await transferToken(wallet.privateKey, tokenAddress, recipientAddress, amount)
      setTxHash(tx.hash)

      toast({
        title: "Transaction sent",
        description: "Your token transfer has been submitted to the network",
      })
    } catch (error) {
      console.error("Error transferring token:", error)
      toast({
        title: "Error",
        description: "Failed to transfer token. Please check your inputs and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!address) {
    return (
      <div className="container max-w-6xl py-10">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <ArrowRight className="h-16 w-16 text-muted-foreground mb-4" />
          <h1 className="text-3xl font-bold tracking-tight">Connect Your Wallet</h1>
          <p className="text-muted-foreground mt-2 mb-6 max-w-md">Connect your wallet to access transfer features</p>
          <Button onClick={() => router.push("/")}>Go to Home</Button>
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
          <p className="text-muted-foreground mt-2 mb-6 max-w-md">
            You need to create a wallet first to transfer tokens
          </p>
          <Button onClick={() => router.push("/wallets")}>Create Wallet</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-6xl py-6 md:py-10">
      <div className="flex items-center gap-2 mb-8">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transfer Token</h1>
          <p className="text-muted-foreground">Send ERC20 tokens to another address</p>
        </div>
      </div>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Send Token</CardTitle>
          <CardDescription>Transfer ERC20 tokens from one of your wallets to any address</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fromWallet">From Wallet</Label>
              <Select value={selectedWallet} onValueChange={setSelectedWallet}>
                <SelectTrigger id="fromWallet">
                  <SelectValue placeholder="Select wallet" />
                </SelectTrigger>
                <SelectContent>
                  {wallets.map((wallet) => (
                    <SelectItem key={wallet.address} value={wallet.address}>
                      {wallet.name || wallet.address.substring(0, 10) + "..."}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tokenAddress">Token Address</Label>
              <Input
                id="tokenAddress"
                placeholder="0x..."
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="toAddress">To Address</Label>
              <Input
                id="toAddress"
                placeholder="0x..."
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.0001"
                min="0"
                placeholder="1.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <Button
              onClick={handleTransfer}
              disabled={isLoading || !selectedWallet || !tokenAddress || !recipientAddress || !amount}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Send Token"
              )}
            </Button>

            {txHash && (
              <div className="mt-4 p-4 border rounded-md">
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
    </div>
  )
}

