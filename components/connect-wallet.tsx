"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ethers } from "ethers"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, X } from "lucide-react"
import { useWalletStore } from "@/lib/store"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import { InjectedConnector } from "wagmi/connectors/injected"

interface ConnectWalletProps {
  onClose: () => void
}

export default function ConnectWallet({ onClose }: ConnectWalletProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [hasMetaMask, setHasMetaMask] = useState(false)
  const { toast } = useToast()
  const { setConnectedWallet, disconnectWallet } = useWalletStore()
  
  // Wagmi hooks
  const { address, isConnected } = useAccount()
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })
  const { disconnect } = useDisconnect()
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasMetaMask(window.ethereum !== undefined)
    }
  }, [])
  
  // Update store when wallet connection changes
  useEffect(() => {
    if (isConnected && address) {
      setConnectedWallet(address, 'metamask')
    }
  }, [isConnected, address, setConnectedWallet])

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
      await connect()
      
      toast({
        title: "Wallet connected",
        description: `Connected to ${address?.substring(0, 6)}...${address?.substring(38)}`,
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
  
  const handleDisconnect = async () => {
    try {
      setIsLoading(true)
      await disconnect()
      disconnectWallet()
      
      toast({
        title: "Wallet disconnected",
        description: "Your wallet has been disconnected",
      })
      
      onClose()
    } catch (error) {
      console.error("Error disconnecting wallet:", error)
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
        {isConnected ? (
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <p className="text-sm font-medium">Connected Address</p>
              <p className="text-xs text-muted-foreground mt-1 break-all">{address}</p>
            </div>
            <Button
              className="w-full"
              variant="destructive"
              onClick={handleDisconnect}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Disconnect Wallet"}
            </Button>
          </div>
        ) : (
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
        )}

        {!hasMetaMask && !isConnected && (
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
  