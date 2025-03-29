import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/layout/header"
import { Toaster } from "@/components/ui/toaster"
import '@rainbow-me/rainbowkit/styles.css'
import { WagmiConfig } from "./providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CryptoVault",
  description: "A modern cryptocurrency wallet with ethers.js integration",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <WagmiConfig>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <Header />
            <main>{children}</main>
            <Toaster />
          </ThemeProvider>
        </WagmiConfig>
      </body>
    </html>
  )
}
