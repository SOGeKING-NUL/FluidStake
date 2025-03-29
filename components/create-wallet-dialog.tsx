"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createRandomWallet, createWalletFromMnemonic, generateMnemonic } from "@/lib/ethereum"
import { useWalletStore } from "@/lib/store"
import { useToast } from "@/components/ui/use-toast"
import { Copy, RefreshCw, Save } from "lucide-react"
import { motion } from "framer-motion"

interface CreateWalletDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CreateWalletDialog({ open, onOpenChange }: CreateWalletDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [walletName, setWalletName] = useState("")
  const [mnemonic, setMnemonic] = useState("")
  const [generatedMnemonic, setGeneratedMnemonic] = useState("")
  const [newWallet, setNewWallet] = useState<{ address: string; privateKey: string; mnemonic?: string } | null>(null)

  const { addWallet, setActiveWallet } = useWalletStore()
  const { toast } = useToast()

  const handleGenerateMnemonic = () => {
    try {
      setIsLoading(true)
      const newMnemonic = generateMnemonic()
      if (newMnemonic) {
        setGeneratedMnemonic(newMnemonic)
        setMnemonic(newMnemonic)
        // Also generate the wallet from this mnemonic
        const wallet = createWalletFromMnemonic(newMnemonic)
        setNewWallet({
          address: wallet.address,
          privateKey: wallet.privateKey,
          mnemonic: newMnemonic,
        })
      }
    } catch (error) {
      console.error("Error generating mnemonic:", error)
      toast({
        title: "Error",
        description: "Failed to generate mnemonic",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateRandomWallet = async () => {
    try {
      setIsLoading(true)
      const wallet = createRandomWallet()

      setNewWallet({
        address: wallet.address,
        privateKey: wallet.privateKey,
        mnemonic: wallet.mnemonic?.phrase,
      })
    } catch (error) {
      console.error("Error creating wallet:", error)
      toast({
        title: "Error",
        description: "Failed to create wallet",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateFromMnemonic = async () => {
    if (!mnemonic) {
      toast({
        title: "Error",
        description: "Please enter a mnemonic phrase",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)
      const wallet = createWalletFromMnemonic(mnemonic)

      setNewWallet({
        address: wallet.address,
        privateKey: wallet.privateKey,
        mnemonic: mnemonic,
      })
    } catch (error) {
      console.error("Error creating wallet from mnemonic:", error)
      toast({
        title: "Error",
        description: "Invalid mnemonic phrase",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveWallet = () => {
    if (!newWallet) return

    const wallet = {
      address: newWallet.address,
      privateKey: newWallet.privateKey,
      mnemonic: newWallet.mnemonic,
      name: walletName || `Wallet ${new Date().toISOString().slice(0, 10)}`,
    }

    addWallet(wallet)
    setActiveWallet(wallet.address)

    toast({
      title: "Wallet created",
      description: "Your wallet has been created and activated",
    })

    onOpenChange(false)
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white/80 dark:bg-black/80 backdrop-blur-md border-white/20 dark:border-black/20">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <DialogHeader className="px-6 pt-6">
            <DialogTitle className="text-2xl font-bold">Create New Wallet</DialogTitle>
            <DialogDescription>Generate a new wallet or import from a mnemonic phrase</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="create" className="mt-4">
            <TabsList className="grid w-full grid-cols-2 px-6">
              <TabsTrigger value="create">Create New</TabsTrigger>
              <TabsTrigger value="mnemonic">From Mnemonic</TabsTrigger>
            </TabsList>

            <TabsContent value="create" className="space-y-4 p-6">
              {!newWallet ? (
                <Button
                  onClick={handleCreateRandomWallet}
                  className="w-full bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Random Wallet"
                  )}
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="walletName">Wallet Name (Optional)</Label>
                    <Input
                      id="walletName"
                      value={walletName}
                      onChange={(e) => setWalletName(e.target.value)}
                      placeholder="My Wallet"
                      className="bg-white/50 dark:bg-black/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="address">Address</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 px-2"
                        onClick={() => copyToClipboard(newWallet.address, "Address")}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="p-2 border rounded-md bg-white/20 dark:bg-black/20 font-mono text-xs break-all">
                      {newWallet.address}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="privateKey">Private Key</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 px-2"
                        onClick={() => copyToClipboard(newWallet.privateKey, "Private Key")}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="p-2 border rounded-md bg-white/20 dark:bg-black/20 font-mono text-xs break-all">
                      {newWallet.privateKey}
                    </div>
                  </div>

                  {newWallet.mnemonic && (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="mnemonic">Mnemonic Phrase</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 px-2"
                          onClick={() => copyToClipboard(newWallet.mnemonic!, "Mnemonic")}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="p-2 border rounded-md bg-white/20 dark:bg-black/20 font-mono text-xs break-all">
                        {newWallet.mnemonic}
                      </div>
                    </div>
                  )}

                  <div className="pt-2">
                    <Button
                      onClick={handleSaveWallet}
                      className="w-full bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save & Use Wallet
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="mnemonic" className="space-y-4 p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="mnemonic">Mnemonic Phrase</Label>
                    <Button variant="outline" size="sm" onClick={handleGenerateMnemonic}>
                      Generate
                    </Button>
                  </div>
                  <Input
                    id="mnemonic"
                    value={mnemonic}
                    onChange={(e) => setMnemonic(e.target.value)}
                    placeholder="Enter mnemonic phrase"
                    className="font-mono bg-white/50 dark:bg-black/50"
                  />
                </div>

                {generatedMnemonic && (
                  <div className="p-2 border rounded-md bg-white/20 dark:bg-black/20 font-mono text-xs break-all">
                    {generatedMnemonic}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2"
                      onClick={() => {
                        setMnemonic(generatedMnemonic)
                        copyToClipboard(generatedMnemonic, "Mnemonic")
                      }}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                )}

                {!newWallet ? (
                  <Button
                    onClick={handleCreateFromMnemonic}
                    className="w-full bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
                    disabled={isLoading || !mnemonic}
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Wallet from Mnemonic"
                    )}
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="walletName">Wallet Name (Optional)</Label>
                      <Input
                        id="walletName"
                        value={walletName}
                        onChange={(e) => setWalletName(e.target.value)}
                        placeholder="My Wallet"
                        className="bg-white/50 dark:bg-black/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="address">Address</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 px-2"
                          onClick={() => copyToClipboard(newWallet.address, "Address")}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="p-2 border rounded-md bg-white/20 dark:bg-black/20 font-mono text-xs break-all">
                        {newWallet.address}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="privateKey">Private Key</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 px-2"
                          onClick={() => copyToClipboard(newWallet.privateKey, "Private Key")}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="p-2 border rounded-md bg-white/20 dark:bg-black/20 font-mono text-xs break-all">
                        {newWallet.privateKey}
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button
                        onClick={handleSaveWallet}
                        className="w-full bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Save & Use Wallet
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 p-6 pt-0">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="sm:w-auto w-full">
              Cancel
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}

