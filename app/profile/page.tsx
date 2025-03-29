"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useWalletStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import { ArrowRight, Copy, Eye, EyeOff, User } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProfilePage() {
  const { address, wallets, disconnect } = useWalletStore()
  const router = useRouter()
  const { toast } = useToast()
  const [showPrivateKey, setShowPrivateKey] = useState<Record<string, boolean>>({})

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

  if (!address) {
    return (
      <div className="container max-w-6xl py-10">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <User className="h-16 w-16 text-muted-foreground mb-4" />
          <h1 className="text-3xl font-bold tracking-tight">Connect Your Wallet</h1>
          <p className="text-muted-foreground mt-2 mb-6 max-w-md">Connect your wallet to access your profile</p>
          <Button onClick={() => router.push("/")}>Go to Home</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-6xl py-6 md:py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">Manage your account and wallets</p>
        </div>
        <Button variant="destructive" onClick={disconnect}>
          Disconnect Wallet
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Connected Wallet</CardTitle>
            <CardDescription>Your currently connected wallet address</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-2 border rounded-md bg-muted font-mono text-xs break-all">
              {address}
              <Button variant="ghost" size="sm" className="ml-2" onClick={() => copyToClipboard(address, "Address")}>
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Wallets</CardTitle>
            <CardDescription>All wallets created in this application</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="list">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="list">Wallet List</TabsTrigger>
                <TabsTrigger value="keys">Private Keys</TabsTrigger>
              </TabsList>
              <TabsContent value="list" className="space-y-4 pt-4">
                {wallets.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">No wallets created yet</p>
                    <Button variant="outline" className="mt-2" onClick={() => router.push("/wallets")}>
                      Create Wallet
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {wallets.map((wallet) => (
                      <div key={wallet.address} className="flex justify-between items-center p-2 border rounded-md">
                        <div>
                          <div className="font-medium">{wallet.name || "Unnamed Wallet"}</div>
                          <div className="font-mono text-xs truncate">{wallet.address}</div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => router.push(`/wallets/${wallet.address}`)}>
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="keys" className="space-y-4 pt-4">
                {wallets.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">No wallets created yet</p>
                    <Button variant="outline" className="mt-2" onClick={() => router.push("/wallets")}>
                      Create Wallet
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {wallets.map((wallet) => (
                      <div key={wallet.address} className="p-3 border rounded-md">
                        <div className="flex justify-between items-center mb-2">
                          <div className="font-medium">{wallet.name || "Unnamed Wallet"}</div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => togglePrivateKey(wallet.address)}
                          >
                            {showPrivateKey[wallet.address] ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <div className="font-mono text-xs truncate mb-2">{wallet.address}</div>
                        <div className="space-y-2">
                          <div className="text-xs font-medium">Private Key</div>
                          <div className="p-2 border rounded-md bg-muted font-mono text-xs break-all">
                            {showPrivateKey[wallet.address]
                              ? wallet.privateKey
                              : "••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••"}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="ml-2"
                              onClick={() => copyToClipboard(wallet.privateKey, "Private Key")}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

