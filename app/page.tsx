"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import CreateWalletDialog from "@/components/create-wallet-dialog"
import { useAccount } from "wagmi"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { ArrowRight, Shield, Wallet, BarChart3 } from "lucide-react"

export default function Home() {
  const router = useRouter()
  const { isConnected } = useAccount()
  const [showCreateWallet, setShowCreateWallet] = useState(false)

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  // Background elements animation
  const floatingCircles = Array(6).fill(null)

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-indigo-950 via-gray-900 to-black">
      {/* Animated background elements */}
      {floatingCircles.map((_, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10"
          style={{
            width: `${Math.random() * 300 + 50}px`,
            height: `${Math.random() * 300 + 50}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, Math.random() * 40 - 20],
            y: [0, Math.random() * 40 - 20],
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
      ))}

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      {/* Content container */}
      <div className="relative flex items-center justify-center w-full h-full px-6 md:px-12">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-5xl">
          {/* Hero Section */}
          <motion.div variants={itemVariants} className="text-center">
            {/* Glowing badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="inline-flex items-center px-4 py-1.5 mb-8 text-sm font-medium text-indigo-200 bg-indigo-950/50 border border-indigo-700/30 rounded-full backdrop-blur-sm"
            >
              <span className="w-2 h-2 mr-2 bg-indigo-400 rounded-full animate-pulse"></span>
              New Wallet Features Available
            </motion.div>

            {/* Heading with gradient text */}
            <h1 className="text-6xl font-extrabold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-purple-200 sm:text-7xl md:text-8xl">
              Secure Your Crypto Future
            </h1>

            {/* Subheading */}
            <motion.p variants={itemVariants} className="max-w-2xl mx-auto mt-6 text-lg text-indigo-200/90 sm:text-xl">
              Discover the easiest way to manage your cryptocurrency. Create wallets, track balances, and transfer
              tokens—all in one place.
            </motion.p>

            {/* Feature highlights */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 gap-4 mt-10 sm:grid-cols-3">
              {[
                { icon: Shield, title: "Secure Storage", desc: "Military-grade encryption" },
                { icon: Wallet, title: "Multi-Chain", desc: "Support for all major networks" },
                { icon: BarChart3, title: "Live Analytics", desc: "Real-time portfolio tracking" },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center p-4 transition-all duration-300 rounded-xl bg-white/5 backdrop-blur-sm hover:bg-white/10"
                >
                  <div className="p-2 mb-3 rounded-full bg-indigo-500/20">
                    <feature.icon className="w-5 h-5 text-indigo-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                  <p className="text-sm text-indigo-200/70">{feature.desc}</p>
                </div>
              ))}
            </motion.div>

            {/* Call-to-Actions */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col items-center justify-center gap-4 mt-10 sm:flex-row"
            >
              <Button
                size="lg"
                onClick={() => setShowCreateWallet(true)}
                className="px-8 text-lg font-medium transition-all duration-300 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white hover:shadow-lg hover:shadow-indigo-500/20"
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => router.push("/dashboard")}
                className="px-8 text-lg font-medium text-indigo-200 transition-all duration-300 border-indigo-500/30 hover:bg-indigo-500/10 hover:border-indigo-400"
              >
                Learn More
              </Button>
            </motion.div>

            {/* Wallet Connection */}
            <motion.div variants={itemVariants} className="mt-8">
              {isConnected ? (
                <div className="inline-flex items-center px-4 py-2 text-sm font-medium text-green-300 bg-green-900/20 rounded-full">
                  <span className="w-2 h-2 mr-2 bg-green-400 rounded-full"></span>
                  Wallet Connected
                </div>
              ) : (
                <div className="flex justify-center mt-4">
                  <div className="p-1 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500">
                    <div className="bg-gray-900 rounded-md">
                      <ConnectButton />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Create Wallet Dialog */}
      {showCreateWallet && <CreateWalletDialog open={showCreateWallet} onOpenChange={setShowCreateWallet} />}
    </div>
  )
}

