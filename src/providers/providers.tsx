'use client'

import { HeroUIProvider } from '@heroui/react'
import { ThemeProvider } from 'next-themes'
import { useEffect, useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <ThemeProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem
      disableTransitionOnChange
      storageKey="desafio-crud-theme"
    >
      <HeroUIProvider>
        <div suppressHydrationWarning>
          {mounted ? children : <div style={{ visibility: 'hidden' }}>{children}</div>}
        </div>
      </HeroUIProvider>
    </ThemeProvider>
  )
}