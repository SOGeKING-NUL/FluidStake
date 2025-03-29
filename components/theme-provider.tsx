// components/layout/theme-provider.tsx
'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { type ReactNode, useEffect, useState } from 'react'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch by only rendering after mounting on client
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="dark" 
      enableSystem={true}
    >
      {children}
    </NextThemesProvider>
  )
}
