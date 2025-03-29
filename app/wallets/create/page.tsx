"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useWalletStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import { ArrowLeft, Copy, RefreshCw, Save } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { createRandomWallet } from "@/lib/ethereum"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function CreateWalletPage() {
  const { address, addWallet } = useWalletStore()
  const router = useRouter()
  const { toast } = useToast()
  const [walletName, setWalletName] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [wallet, setWallet] = useState<{
    address: string
    privateKey: string
    mnemonic?: string
  } | null>(null)

  const handleCreateWallet = () => {
    try {
      setIsGenerating(true)
      const newWallet = createRandomWallet()

      setWallet({
        address: newWallet.address,
        privateKey: newWallet.privateKey,
        mnemonic: newWallet.mnemonic?.phrase,
      })

      toast({
        title: "Wallet created",
        description: "New wallet has been generated successfully",
      })
    } catch (error) {
      console.error("Error creating wallet:", error)
      toast({
        title: "Error",
        description: "Failed to create wallet",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveWallet = () => {
    if (!wallet) return

    try {
      setIsSaving(true)
      addWallet({
        address: wallet.address,
        privateKey: wallet.privateKey,
        mnemonic: wallet.mnemonic,
        name: walletName || `Wallet ${new Date().toISOString().slice(0, 10)}`,
      })

      toast({
        title: "Wallet saved",
        description: "Your wallet has been saved successfully",
      })

      router.push("/wallets")
    } catch (error) {
      console.error("Error saving wallet:", error)
      toast({
        title: "Error",
        description: "Failed to save wallet",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
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
          <h1 className="text-3xl font-bold tracking-tight">Connect Your Wallet</h1>
          <p className="text-muted-foreground mt-2 mb-6 max-w-md">Connect your wallet to access this feature</p>
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
          <h1 className="text-3xl font-bold tracking-tight">Create New Wallet</h1>
          <p className="text-muted-foreground">Generate a new random wallet</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Generate Wallet</CardTitle>
            <CardDescription>Create a new random wallet with private key and mnemonic</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button onClick={handleCreateWallet} disabled={isGenerating} className="w-full">
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate New Wallet"
                )}
              </Button>

              {wallet && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="walletName">Wallet Name (Optional)</Label>
                    <Input
                      id="walletName"
                      value={walletName}
                      onChange={(e) => setWalletName(e.target.value)}
                      placeholder="My Wallet"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="address">Address</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 px-2"
                        onClick={() => copyToClipboard(wallet.address, "Address")}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="p-2 border rounded-md bg-muted font-mono text-xs break-all">{wallet.address}</div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="privateKey">Private Key</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 px-2"
                        onClick={() => copyToClipboard(wallet.privateKey, "Private Key")}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="p-2 border rounded-md bg-muted font-mono text-xs break-all">
                      {wallet.privateKey}
                    </div>
                  </div>

                  {wallet.mnemonic && (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="mnemonic">Mnemonic Phrase</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 px-2"
                          onClick={() => copyToClipboard(wallet.mnemonic!, "Mnemonic")}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="p-2 border rounded-md bg-muted font-mono text-xs break-all">
                        {wallet.mnemonic}
                      </div>
                    </div>
                  )}

                  <Alert className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900">
                    <AlertDescription className="text-amber-800 dark:text-amber-300 text-xs">
                      Important: Save your private key and mnemonic phrase in a secure location. Anyone with access to
                      them can access your funds.
                    </AlertDescription>
                  </Alert>

                  <Button onClick={handleSaveWallet} disabled={isSaving} className="w-full">
                    {isSaving ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Wallet
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Other Options</CardTitle>
            <CardDescription>Additional wallet creation methods</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button onClick={() => router.push("/wallets/mnemonic")} className="w-full">
                Generate from Mnemonic
              </Button>
              <Button variant="outline" onClick={() => router.push("/wallets")} className="w-full">
                View All Wallets
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

