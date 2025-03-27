"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import Dashboard from "@/components/dashboard";
import CreateWallet from "@/components/create-wallet";
import ImportWallet from "@/components/import-wallet";
import SendTransaction from "@/components/send-transaction";
import TokenManagement from "@/components/token-management";
import { WalletProvider } from "@/context/wallet-context";

export default function Home() {
  return (
    <WalletProvider>
      <main className="container mx-auto p-4 max-w-5xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Ethereum Wallet</h1>
        
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="create">Create Wallet</TabsTrigger>
            <TabsTrigger value="import">Import Wallet</TabsTrigger>
            <TabsTrigger value="send">Send</TabsTrigger>
            <TabsTrigger value="tokens">Tokens</TabsTrigger>
          </TabsList>
          
          <Card className="p-6">
            <TabsContent value="dashboard">
              <Dashboard />
            </TabsContent>
            
            <TabsContent value="create">
              <CreateWallet />
            </TabsContent>
            
            <TabsContent value="import">
              <ImportWallet />
            </TabsContent>
            
            <TabsContent value="send">
              <SendTransaction />
            </TabsContent>
            
            <TabsContent value="tokens">
              <TokenManagement />
            </TabsContent>
          </Card>
        </Tabs>
      </main>
    </WalletProvider>
  );
}
