import { useState } from 'react';
import { Wallet, LayoutDashboard, ArrowUpDown, Settings, Bell, Copy, ExternalLink, ChevronDown, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';

function App() {
  const [activeTab, setActiveTab] = useState("tokens");
  const [currentNetwork, setCurrentNetwork] = useState("Solana");
  
  // Mock data
  const walletAddress = "8xrt45...9j7Kl";
  const walletBalance = 234.56;
  const tokens = [
    { name: "Solana", symbol: "SOL", balance: 4.5, value: 180.45, change: 2.3, logo: "https://cryptologos.cc/logos/solana-sol-logo.png" },
    { name: "Ethereum", symbol: "ETH", balance: 0.12, value: 54.11, change: -1.2, logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png" },
    { name: "USD Coin", symbol: "USDC", balance: 125.00, value: 125.00, change: 0, logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png" },
  ];
  
  const nfts = [
    { name: "Degen Ape #1234", collection: "Degen Ape Academy", image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" },
    { name: "Solana Monkey #5678", collection: "SMB", image: "https://images.unsplash.com/photo-1561414927-6d86591d0c4f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" },
    { name: "Okay Bear #910", collection: "Okay Bears", image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" },
  ];
  
  const activity = [
    { type: "Send", asset: "SOL", amount: 0.5, date: "Today, 2:30 PM", status: "completed", address: "3xrt45...9j7Kl" },
    { type: "Receive", asset: "USDC", amount: 25, date: "Yesterday, 10:15 AM", status: "completed", address: "7prt45...2j7Kl" },
    { type: "Swap", asset: "ETH → SOL", amount: 0.05, date: "May 10, 4:45 PM", status: "completed", address: "" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border py-4 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Wallet className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">Phantom</span>
          </div>
          
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  {currentNetwork}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setCurrentNetwork("Solana")}>Solana</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCurrentNetwork("Ethereum")}>Ethereum</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCurrentNetwork("Polygon")}>Polygon</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            
            <Avatar className="h-8 w-8 bg-primary/10">
              <div className="text-xs font-medium">PW</div>
            </Avatar>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 py-8">
        <div className="max-w-3xl mx-auto px-4">
          {/* Wallet Info */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold mb-2">My Wallet</h1>
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-sm text-muted-foreground">{walletAddress}</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy address</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View on explorer</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <h2 className="text-3xl font-bold mb-4">${walletBalance.toFixed(2)}</h2>
            
            <div className="flex justify-center gap-2">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Buy
              </Button>
              <Button className="gap-2">
                <ArrowUpDown className="h-4 w-4" />
                Swap
              </Button>
              <Button variant="outline" className="gap-2">
                Send
              </Button>
              <Button variant="outline" className="gap-2">
                Receive
              </Button>
            </div>
          </div>
          
          {/* Tabs */}
          <Tabs defaultValue="tokens" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="tokens">Tokens</TabsTrigger>
              <TabsTrigger value="nfts">NFTs</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tokens" className="space-y-4">
              <ScrollArea className="h-[400px] pr-4">
                {tokens.map((token, index) => (
                  <Card key={index} className="mb-3">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 rounded-full">
                            <img src={token.logo} alt={token.name} className="object-cover" />
                          </Avatar>
                          <div>
                            <div className="font-medium">{token.name}</div>
                            <div className="text-sm text-muted-foreground">{token.balance} {token.symbol}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${token.value.toFixed(2)}</div>
                          <div className={cn(
                            "text-sm",
                            token.change > 0 ? "text-green-500" : token.change < 0 ? "text-red-500" : "text-muted-foreground"
                          )}>
                            {token.change > 0 ? "+" : ""}{token.change}%
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="nfts" className="space-y-4">
              <ScrollArea className="h-[400px] pr-4">
                <div className="grid grid-cols-2 gap-4">
                  {nfts.map((nft, index) => (
                    <Card key={index} className="overflow-hidden">
                      <img src={nft.image} alt={nft.name} className="w-full h-40 object-cover" />
                      <CardContent className="p-3">
                        <div className="font-medium truncate">{nft.name}</div>
                        <div className="text-sm text-muted-foreground">{nft.collection}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="activity" className="space-y-4">
              <ScrollArea className="h-[400px] pr-4">
                {activity.map((item, index) => (
                  <Card key={index} className="mb-3">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "h-10 w-10 rounded-full flex items-center justify-center",
                            item.type === "Send" ? "bg-orange-100" : 
                            item.type === "Receive" ? "bg-green-100" : "bg-blue-100"
                          )}>
                            <span className={cn(
                              "text-sm font-medium",
                              item.type === "Send" ? "text-orange-600" : 
                              item.type === "Receive" ? "text-green-600" : "text-blue-600"
                            )}>
                              {item.type === "Send" ? "S" : item.type === "Receive" ? "R" : "SW"}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">{item.type}</div>
                            <div className="text-sm text-muted-foreground">{item.date}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {item.type === "Send" ? "-" : item.type === "Receive" ? "+" : ""}{item.amount} {item.asset}
                          </div>
                          <div className="text-sm">
                            <Badge variant="outline" className="font-normal">
                              {item.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      {item.address && (
                        <div className="mt-2 text-sm text-muted-foreground">
                          {item.type === "Send" ? "To: " : "From: "}{item.address}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border py-4 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            © 2025 Phantom Wallet
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" size="sm">Help</Button>
            <Button variant="ghost" size="sm">Privacy</Button>
            <Button variant="ghost" size="sm">Terms</Button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;