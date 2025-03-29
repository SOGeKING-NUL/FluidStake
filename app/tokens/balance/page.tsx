"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useWalletStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import { ArrowLeft, Coins, RefreshCw } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { getTokenBalance, getNativeBalance } from "@/lib/ethereum"

export default function TokenBalancePage() {
  const { address } = useWalletStore()
  const router = useRouter()
  const { toast } = useToast()
  const [walletAddress, setWalletAddress] = useState(address || "")
  const [tokenAddress, setTokenAddress] = useState("")
  const [isLoadingNative, setIsLoadingNative] = useState(false)
  const [isLoadingToken, setIsLoadingToken] = useState(false)
  const [nativeBalance, setNativeBalance] = useState<string | null>(null)
  const [tokenBalance, setTokenBalance] = useState<{
    balance: string
    symbol: string
  } | null>(null)

  const handleGetNativeBalance = async () => {
    if (!walletAddress) {
      toast({
        title: "Error",
        description: "Please enter a wallet address",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoadingNative(true)
      const balance = await getNativeBalance(walletAddress)
      setNativeBalance(balance)
    } catch (error) {
      console.error("Error getting native balance:", error)
      toast({
        title: "Error",
        description: "Failed to get native balance",
        variant: "destructive",
      })
    } finally {
      setIsLoadingNative(false)
    }
  }

  const handleGetTokenBalance = async () => {
    if (!walletAddress || !tokenAddress) {
      toast({
        title: "Error",
        description: "Please enter both wallet and token addresses",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoadingToken(true)
      const balance = await getTokenBalance(tokenAddress, walletAddress)
      setTokenBalance(balance)
    } catch (error) {
      console.error("Error getting token balance:", error)
      toast({
        title: "Error",
        description: "Failed to get token balance. Make sure the token address is valid.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingToken(false)
    }
  }

  if (!address) {
    return (
      <div className="container max-w-6xl py-10">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <Coins className="h-16 w-16 text-muted-foreground mb-4" />
          <h1 className="text-3xl font-bold tracking-tight">Connect Your Wallet</h1>
          <p className="text-muted-foreground mt-2 mb-6 max-w-md">
            Connect your wallet to access token balance features
          </p>
          <Button onClick={() => router.push("/")}>Go to Home</Button>
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
          <h1 className="text-3xl font-bold tracking-tight">Check Token Balance</h1>
          <p className="text-muted-foreground">View native and ERC20 token balances</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Native Balance (ETH)</CardTitle>
            <CardDescription>Check the ETH balance of any address</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="walletAddress">Wallet Address</Label>
                <Input
                  id="walletAddress"
                  placeholder="0x..."
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                />
              </div>
              <Button onClick={handleGetNativeBalance} disabled={isLoadingNative || !walletAddress} className="w-full">
                {isLoadingNative ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Check ETH Balance"
                )}
              </Button>

              {nativeBalance !== null && (
                <div className="mt-4 p-4 border rounded-md">
                  <div className="text-sm font-medium">Balance</div>
                  <div className="text-2xl font-bold">{nativeBalance} ETH</div>
                  <div className="text-xs text-muted-foreground mt-1">Sepolia Testnet</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ERC20 Token Balance</CardTitle>
            <CardDescription>Check the balance of any ERC20 token</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tokenWalletAddress">Wallet Address</Label>
                <Input
                  id="tokenWalletAddress"
                  placeholder="0x..."
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                />
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
              <Button
                onClick={handleGetTokenBalance}
                disabled={isLoadingToken || !walletAddress || !tokenAddress}
                className="w-full"
              >
                {isLoadingToken ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Check Token Balance"
                )}
              </Button>

              {tokenBalance && (
                <div className="mt-4 p-4 border rounded-md">
                  <div className="text-sm font-medium">Balance</div>
                  <div className="text-2xl font-bold">
                    {tokenBalance.balance} {tokenBalance.symbol}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

