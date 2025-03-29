"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useWalletStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import { ArrowRight, ExternalLink, RefreshCw, Search } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { getTransaction } from "@/lib/ethereum"
import { Skeleton } from "@/components/ui/skeleton"

export default function TransactionsPage() {
  const { address } = useWalletStore()
  const router = useRouter()
  const { toast } = useToast()
  const [txHash, setTxHash] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [transaction, setTransaction] = useState<any>(null)

  const handleGetTransaction = async () => {
    if (!txHash) {
      toast({
        title: "Error",
        description: "Please enter a transaction hash",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)
      const tx = await getTransaction(txHash)
      setTransaction(tx)
    } catch (error) {
      console.error("Error getting transaction:", error)
      toast({
        title: "Error",
        description: "Failed to get transaction details. Make sure the hash is valid.",
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
          <p className="text-muted-foreground mt-2 mb-6 max-w-md">Connect your wallet to access transaction features</p>
          <Button onClick={() => router.push("/")}>Go to Home</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-6xl py-6 md:py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">View transaction details</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction Details</CardTitle>
          <CardDescription>Look up transaction details by hash</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="txHash">Transaction Hash</Label>
              <div className="flex gap-2">
                <Input id="txHash" placeholder="0x..." value={txHash} onChange={(e) => setTxHash(e.target.value)} />
                <Button onClick={handleGetTransaction} disabled={isLoading || !txHash}>
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
            ) : transaction ? (
              <div className="space-y-4 border rounded-md p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium">Transaction Hash</div>
                    <div className="font-mono text-xs break-all">{transaction.hash}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Status</div>
                    <div className={`text-sm ${transaction.status === "Success" ? "text-green-500" : "text-red-500"}`}>
                      {transaction.status}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">From</div>
                    <div className="font-mono text-xs break-all">{transaction.from}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">To</div>
                    <div className="font-mono text-xs break-all">{transaction.to}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Value</div>
                    <div className="text-sm">{transaction.value} ETH</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Gas Price</div>
                    <div className="text-sm">{transaction.gasPrice} Gwei</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Block Number</div>
                    <div className="text-sm">{transaction.blockNumber}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Confirmations</div>
                    <div className="text-sm">{transaction.confirmations}</div>
                  </div>
                </div>
                <div className="pt-2">
                  <a
                    href={`https://sepolia.etherscan.io/tx/${transaction.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-primary text-sm"
                  >
                    View on Etherscan
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

