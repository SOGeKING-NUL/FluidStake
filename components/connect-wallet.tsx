"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ethers } from "ethers"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, X } from "lucide-react"
import { useWalletStore } from "@/lib/store"

interface ConnectWalletProps {
  onClose: () => void
}

export default function ConnectWallet({ onClose }: ConnectWalletProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [hasMetaMask, setHasMetaMask] = useState(false)
  const { toast } = useToast()
  const { setAddress, setProvider, setSigner } = useWalletStore()

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasMetaMask(window.ethereum !== undefined)
    }
  }, [])

  const connectMetaMask = async () => {
    if (!window.ethereum) {
      toast({
        title: "MetaMask not detected",
        description: "Please install MetaMask extension to continue",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)
      const provider = new ethers.BrowserProvider(window.ethereum)
      const accounts = await provider.send("eth_requestAccounts", [])
      const signer = await provider.getSigner()

      setProvider(provider)
      setSigner(signer)
      setAddress(accounts[0])

      toast({
        title: "Wallet connected",
        description: `Connected to ${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}`,
      })

      onClose()
    } catch (error) {
      console.error("Error connecting to MetaMask:", error)
      toast({
        title: "Connection failed",
        description: "Failed to connect to MetaMask",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Connect Wallet</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>Connect your wallet to access all features</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          className="w-full flex items-center justify-center gap-2 h-14"
          onClick={connectMetaMask}
          disabled={isLoading || !hasMetaMask}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <img src="/metamask.svg" alt="MetaMask" className="h-6 w-6" />
              Connect with MetaMask
            </>
          )}
        </Button>

        {!hasMetaMask && (
          <p className="text-sm text-muted-foreground mt-2 text-center">
            MetaMask not detected. Please install the{" "}
            <a
              href="https://metamask.io/download/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              MetaMask extension
            </a>
          </p>
        )}
      </CardContent>
    </Card>
  )
}

