"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useWalletStore } from "@/lib/store"
import { Menu, X, Wallet } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import CreateWalletDialog from "@/components/create-wallet-dialog"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showCreateWallet, setShowCreateWallet] = useState(false)
  const { theme, setTheme } = useTheme()
  const { activeWallet, setActiveWallet, wallets } = useWalletStore()
  const pathname = usePathname()

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Wallets", href: "/wallets" },
    { name: "Tokens", href: "/tokens" },
    { name: "Transactions", href: "/transactions" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 dark:border-black/10 bg-white/80 dark:bg-black/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-black/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Wallet className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">CryptoVault</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 ml-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.href ? "text-primary" : "text-muted-foreground",
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
            className="rounded-full"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {activeWallet ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 rounded-full px-2 text-sm">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {activeWallet.address.substring(2, 4).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline">
                    {activeWallet.name || activeWallet.address.substring(0, 6) + "..."}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium text-sm">Active Wallet</p>
                    <p className="w-[200px] truncate text-xs text-muted-foreground">{activeWallet.address}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                {wallets.length > 1 && (
                  <>
                    <DropdownMenuItem className="font-medium text-xs text-muted-foreground">
                      SWITCH WALLET
                    </DropdownMenuItem>
                    {wallets
                      .filter((w) => w.address !== activeWallet.address)
                      .map((wallet) => (
                        <DropdownMenuItem
                          key={wallet.address}
                          onClick={() => setActiveWallet(wallet.address)}
                          className="cursor-pointer"
                        >
                          <Avatar className="h-4 w-4 mr-2">
                            <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
                              {wallet.address.substring(2, 4).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          {wallet.name || wallet.address.substring(0, 10) + "..."}
                        </DropdownMenuItem>
                      ))}
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/wallets">My Wallets</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowCreateWallet(true)} className="cursor-pointer">
                  Create New Wallet
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={() => setShowCreateWallet(true)}
              className="hidden md:flex bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
            >
              Create Wallet
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle Menu"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in md:hidden bg-background/95 backdrop-blur-md border-t">
          <div className="relative z-20 grid gap-6 p-4 rounded-md">
            <nav className="grid grid-flow-row auto-rows-max text-sm">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex w-full items-center rounded-md p-2 text-sm font-medium hover:bg-muted",
                    pathname === item.href ? "bg-muted" : "",
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            {!activeWallet && (
              <Button
                onClick={() => {
                  setShowCreateWallet(true)
                  setIsMenuOpen(false)
                }}
                className="bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
              >
                Create Wallet
              </Button>
            )}
          </div>
        </div>
      )}

      {showCreateWallet && <CreateWalletDialog open={showCreateWallet} onOpenChange={setShowCreateWallet} />}
    </header>
  )
}

