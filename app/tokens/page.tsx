"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useWalletStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import { ArrowRight, Coins, RefreshCw, Search } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { getTokenInfo } from "@/lib/ethereum"
import { Skeleton } from "@/components/ui/skeleton"
import CreateWalletDialog from "@/components/create-wallet-dialog"
import { motion } from "framer-motion"

export default function TokensPage() {
  const { activeWallet } = useWalletStore()
  const router = useRouter()
  const { toast } = useToast()
  const [tokenAddress, setTokenAddress] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showCreateWallet, setShowCreateWallet] = useState(false)
  const [tokenInfo, setTokenInfo] = useState<{
    name: string
    symbol: string
    decimals: number
    totalSupply: string
  } | null>(null)

  const handleGetTokenInfo = async () => {
    if (!tokenAddress) {
      toast({
        title: "Error",
        description: "Please enter a token address",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)
      const info = await getTokenInfo(tokenAddress)
      setTokenInfo(info)
    } catch (error) {
      console.error("Error getting token info:", error)
      toast({
        title: "Error",
        description: "Failed to get token information. Make sure the address is valid.",
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
          <Coins className="h-16 w-16 text-muted-foreground mb-4" />
          <h1 className="text-3xl font-bold tracking-tight">Create Your First Wallet</h1>
          <p className="text-muted-foreground mt-2 mb-6 max-w-md">Create a wallet to access token features</p>
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight gradient-text">Tokens</h1>
            <p className="text-muted-foreground">Manage and interact with ERC20 tokens</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="glass-card glow">
            <CardHeader>
              <CardTitle>Get Token Info</CardTitle>
              <CardDescription>Retrieve information about an ERC20 token</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tokenAddress">Token Address</Label>
                  <div className="flex gap-2">
                    <Input
                      id="tokenAddress"
                      placeholder="0x..."
                      value={tokenAddress}
                      onChange={(e) => setTokenAddress(e.target.value)}
                      className="bg-white/20 dark:bg-black/20"
                    />
                    <Button
                      onClick={handleGetTokenInfo}
                      disabled={isLoading || !tokenAddress}
                      className="bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
                    >
                      {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : tokenInfo ? (
                  <div className="space-y-4 border rounded-md p-4 border-white/10 dark:border-black/10 bg-white/20 dark:bg-black/20">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div className="text-sm font-medium">Name</div>
                        <div className="text-lg">{tokenInfo.name}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Symbol</div>
                        <div className="text-lg">{tokenInfo.symbol}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div className="text-sm font-medium">Decimals</div>
                        <div className="text-lg">{tokenInfo.decimals}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Total Supply</div>
                        <div className="text-lg">{tokenInfo.totalSupply}</div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card glow">
            <CardHeader>
              <CardTitle>Token Operations</CardTitle>
              <CardDescription>Check balances and transfer tokens</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                className="w-full justify-between bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
                onClick={() => router.push("/tokens/balance")}
              >
                Check Token Balance
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                className="w-full justify-between border-black/20 dark:border-white/20"
                variant="outline"
                onClick={() => router.push("/transfer/token")}
              >
                Transfer Tokens
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  )
}

