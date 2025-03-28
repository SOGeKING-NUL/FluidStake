"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useWalletStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import { ArrowRight, Coins, Wallet, RefreshCw, Plus, LayoutDashboard } from "lucide-react"
import { getNativeBalance } from "@/lib/ethereum"
import { Skeleton } from "@/components/ui/skeleton"
import CreateWalletDialog from "@/components/create-wallet-dialog"
import { motion } from "framer-motion"

export default function DashboardPage() {
  const { activeWallet, wallets } = useWalletStore()
  const router = useRouter()
  const [balance, setBalance] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showCreateWallet, setShowCreateWallet] = useState(false)

  useEffect(() => {
    if (activeWallet) {
      fetchBalance(activeWallet.address)
    }
  }, [activeWallet])

  const fetchBalance = async (addr: string) => {
    try {
      setIsLoading(true)
      const bal = await getNativeBalance(addr)
      setBalance(bal)
    } catch (error) {
      console.error("Error fetching balance:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!activeWallet) {
    return (
      <div className="container max-w-6xl py-10">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <LayoutDashboard className="h-16 w-16 text-muted-foreground mb-4" />
          <h1 className="text-3xl font-bold tracking-tight">Create Your First Wallet</h1>
          <p className="text-muted-foreground mt-2 mb-6 max-w-md">
            Create a wallet to access the dashboard and manage your crypto assets.
          </p>
          <Button
            onClick={() => setShowCreateWallet(true)}
            className="bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
          >
            <Plus className="mr-2 h-4 w-4" />
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
            <h1 className="text-3xl font-bold tracking-tight gradient-text">Dashboard</h1>
            <p className="text-muted-foreground">Manage your crypto assets and wallets</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => activeWallet && fetchBalance(activeWallet.address)}
              disabled={isLoading}
              className="border-black/20 dark:border-white/20"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button
              size="sm"
              onClick={() => setShowCreateWallet(true)}
              className="bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Wallet
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="glass-card glow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Wallet</CardTitle>
              <CardDescription className="font-mono text-xs truncate">{activeWallet.address}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? <Skeleton className="h-8 w-24" /> : `${balance || "0.00"} ETH`}
              </div>
              <p className="text-xs text-muted-foreground">Sepolia Testnet</p>
            </CardContent>
          </Card>

          <Card className="glass-card glow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Your Wallets</CardTitle>
              <CardDescription>
                {wallets.length} wallet{wallets.length !== 1 ? "s" : ""} created
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-between items-center">
              <div className="text-2xl font-bold flex items-center">
                <Wallet className="h-5 w-5 mr-2 text-muted-foreground" />
                {wallets.length}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/wallets")}
                className="hover:bg-white/10 dark:hover:bg-black/10"
              >
                Manage
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card glow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Token Operations</CardTitle>
              <CardDescription>Check balances and transfer tokens</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-between items-center">
              <div className="text-2xl font-bold flex items-center">
                <Coins className="h-5 w-5 mr-2 text-muted-foreground" />
                Tokens
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/tokens")}
                className="hover:bg-white/10 dark:hover:bg-black/10"
              >
                Explore
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Tabs defaultValue="features">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="recent">Recent Activity</TabsTrigger>
            </TabsList>
            <TabsContent value="features" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="overflow-hidden glass-card glow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Create New Wallet</CardTitle>
                    <CardDescription>Generate a new wallet with private key and mnemonic</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => setShowCreateWallet(true)}
                        className="w-full bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Random Wallet
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => router.push("/wallets/mnemonic")}
                        className="w-full border-black/20 dark:border-white/20"
                      >
                        <Wallet className="h-4 w-4 mr-2" />
                        Generate Mnemonic
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden glass-card glow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Token Operations</CardTitle>
                    <CardDescription>Manage and transfer tokens</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => router.push("/tokens/balance")}
                        className="w-full justify-between bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
                      >
                        Check Token Balance
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => router.push("/transfer/token")}
                        className="w-full justify-between border-black/20 dark:border-white/20"
                      >
                        Transfer Tokens
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden glass-card glow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">ETH Operations</CardTitle>
                    <CardDescription>Manage and transfer ETH</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => router.push("/transfer/eth")}
                        className="w-full justify-between bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
                      >
                        Transfer ETH
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => activeWallet && fetchBalance(activeWallet.address)}
                        className="w-full justify-between border-black/20 dark:border-white/20"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Refreshing...
                          </>
                        ) : (
                          <>
                            Refresh Balance
                            <RefreshCw className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden glass-card glow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Transaction History</CardTitle>
                    <CardDescription>View transaction details</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => router.push("/transactions")}
                        className="w-full justify-between bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
                      >
                        View Transactions
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => router.push("/wallets")}
                        className="w-full justify-between border-black/20 dark:border-white/20"
                      >
                        Manage Wallets
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="recent" className="mt-6">
              <div className="rounded-md border border-white/10 dark:border-black/10 glass-card">
                <div className="p-4 text-center text-sm text-muted-foreground">
                  <div className="flex flex-col items-center justify-center py-4">
                    <RefreshCw className="h-8 w-8 text-muted-foreground mb-2" />
                    <p>No recent activity to display</p>
                    <p className="text-xs mt-1">Your recent transactions will appear here</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {showCreateWallet && <CreateWalletDialog open={showCreateWallet} onOpenChange={setShowCreateWallet} />}
      </motion.div>
    </div>
  )
}

