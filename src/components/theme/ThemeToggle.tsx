'use client'

import { Button } from "@heroui/react"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import { useEffect, useState } from "react"

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render anything until mounted on client
  if (!mounted) {
    return (
      <Button
        isIconOnly
        variant="ghost"
        size="sm"
        className="fixed top-4 right-4 z-50 opacity-0"
        aria-label="Toggle theme"
      >
        <Sun size={18} />
      </Button>
    )
  }

  const toggleTheme = () => {
    // Alterna apenas entre light e dark (sem system)
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  const getIcon = () => {
    if (resolvedTheme === 'dark') {
      return <Moon size={18} className="text-blue-400" />
    } else {
      return <Sun size={18} className="text-yellow-500" />
    }
  }

  return (
    <Button
      isIconOnly
      variant="ghost"
      size="sm"
      className="fixed top-4 right-4 z-50 hover:bg-default-100 transition-colors"
      onPress={toggleTheme}
      aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} theme`}
    >
      {getIcon()}
    </Button>
  )
}