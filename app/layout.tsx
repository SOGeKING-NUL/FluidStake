import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FluidStake",
  description: "A modern cryptocurrency wallet with ethers.js integration",
  icons: {
    icon: [
      { url: "/fluidstake.png", sizes: "512x512", type: "image/png" }, // Add sizes attribute
    ],
    apple: [
      { url: "/fluidstake.png", sizes: "180x180", type: "image/png" }, // For Apple devices
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="dark" >
        <Providers>
          <ThemeProvider
          >
            <main>{children}</main>
            <Toaster />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
