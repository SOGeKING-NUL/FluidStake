"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWalletStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { RefreshCw, ExternalLink } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAccount } from "wagmi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getTransactionHistory } from "@/lib/ethereum";
import Header from "@/components/layout/header";

export default function TransactionsPage() {
  const { activeWallet, wallets } = useWalletStore();
  const { isConnected, address } = useAccount();
  const router = useRouter();
  const { toast } = useToast();
  const [isFetchingHistory, setIsFetchingHistory] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<string>("");
  
  // Define hardcoded transactions directly as a constant
  const HARDCODED_TRANSACTIONS = [
    {
      hash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      from: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef",
      to: "0x1234123412341234123412341234123412341234",
      value: "0.5",
      asset: "ETH",
      category: "external",
      blockNumber: 12345678,
      status: "Confirmed",
      timestamp: "2025-03-29 10:00 PM",
    },
    {
      hash: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcd",
      from: "0x1234123412341234123412341234123412341234",
      to: "0x5678567856785678567856785678567856785678",
      value: "1.2",
      asset: "ETH",
      category: "internal",
      blockNumber: 12345679,
      status: "Confirmed",
      timestamp: "2025-03-29 10:05 PM",
    },
    {
      hash: "0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba",
      from: "0x5678567856785678567856785678567856785678",
      to: "0x9abc9abc9abc9abc9abc9abc9abc9abc9abc9abc",
      value: "2.3",
      asset: "ETH",
      category: "erc20",
      blockNumber: null,
      status: "Pending",
      timestamp: null,
    },
  ];
  
  // Initialize state with hardcoded transactions
  const [transactionHistory, setTransactionHistory] = useState(HARDCODED_TRANSACTIONS);

  useEffect(() => {
    // Just log to verify state is initialized correctly
    console.log("Initial transactions:", transactionHistory);
  }, []);

  useEffect(() => {
    if (activeWallet) {
      setSelectedWallet(activeWallet.address);
    } else if (address) {
      setSelectedWallet(address);
    }
  }, [activeWallet, address]);

  // Modified to preserve hardcoded transactions if API call fails
  const fetchTransactionHistory = async (walletAddress: string) => {
    if (!walletAddress) return;
    
    setIsFetchingHistory(true);
    try {
      // Try to fetch from API
      const history = await getTransactionHistory(walletAddress);
      
      if (history && history.length > 0) {
        // Only replace hardcoded data if API returns results
        setTransactionHistory(history);
        toast({
          title: "Success",
          description: `Retrieved ${history.length} transactions`,
        });
      } else {
        // Fallback to hardcoded data if API returns empty
        setTransactionHistory(HARDCODED_TRANSACTIONS);
        toast({
          title: "Notice",
          description: "Using demo transactions (API returned no data)",
        });
      }
    } catch (error) {
      console.error("Error fetching transaction history:", error);
      // On error, ensure hardcoded data is displayed
      setTransactionHistory(HARDCODED_TRANSACTIONS);
      toast({
        title: "Demo Mode",
        description: "Showing sample transactions (API error)",
      });
    } finally {
      setIsFetchingHistory(false);
    }
  };

  return (
    <>
      <Header />
      <div className="container max-w-6xl py-6 md:py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Transaction History</h1>
            <p className="text-muted-foreground">View and track your wallet transactions</p>
          </div>
          <div className="w-full md:w-64">
            <Select
              value={selectedWallet}
              onValueChange={(value) => setSelectedWallet(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select wallet" />
              </SelectTrigger>
              <SelectContent>
                {[...(wallets || []), ...(address ? [{ name: "Connected Wallet", address }] : [])].map((wallet) => (
                  <SelectItem key={wallet.address} value={wallet.address}>
                    {wallet.name || `${wallet.address.substring(0, 10)}...`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle>Wallet Transaction History</CardTitle>
                <CardDescription>
                  {selectedWallet ? 
                    `View all transactions for wallet: ${selectedWallet.substring(0, 10)}...${selectedWallet.substring(36)}` :
                    "Demo transactions (example data)"}
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchTransactionHistory(selectedWallet)}
                disabled={isFetchingHistory}
              >
                {isFetchingHistory ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isFetchingHistory ? (
              <div className="flex justify-center items-center h-40">
                <RefreshCw className="h-8 w-8 animate-spin" />
                <p className="ml-2">Loading transaction history...</p>
              </div>
            ) : (
              /* Force render the transaction list regardless of length */
              <div className="space-y-4">
                {/* Debugging info to help troubleshoot */}
                <p className="text-xs text-muted-foreground mb-4">
                  Displaying {transactionHistory.length} transactions
                </p>
                
                {transactionHistory.map((tx, index) => (
                  <div key={index} className="p-4 border rounded hover:bg-muted transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">Transaction Hash:</p>
                        <div className="flex items-center space-x-2">
                          <code className="text-sm">
                            {tx.hash?.substring(0, 18)}...{tx.hash?.substring(58)}
                          </code>
                          <a 
                            href={`https://sepolia.etherscan.io/tx/${tx.hash}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                      </div>
                      <div className="text-right">
                        {tx.status && (
                          <span className={`px-2 py-1 rounded text-xs ${
                            tx.status === 'Pending' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {tx.status}
                          </span>
                        )}
                        {tx.category && (
                          <span className="ml-2 px-2 py-1 rounded text-xs bg-purple-100 text-purple-800">
                            {tx.category}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                      <div>
                        <p className="text-sm text-muted-foreground">From:</p>
                        <p className="text-sm font-mono">{tx.from?.substring(0, 10)}...{tx.from?.substring(36)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">To:</p>
                        <p className="text-sm font-mono">{tx.to?.substring(0, 10)}...{tx.to?.substring(36)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Value:</p>
                        <p className="text-sm">{tx.value} {tx.asset || "ETH"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Block:</p>
                        <p className="text-sm">{tx.blockNumber || 'Pending'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Time:</p>
                        <p className="text-sm">{tx.timestamp || 'Processing...'}</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {transactionHistory.length === 0 && (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">No transactions found for this wallet.</p>
                    <p className="text-sm mt-2">Try another wallet or make some transactions first.</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>  
    </>
  );
}
