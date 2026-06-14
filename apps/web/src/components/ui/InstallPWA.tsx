"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export function InstallPWA({ variant = "default", className = "" }: { variant?: "default" | "sidebar", className?: string }) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true) {
      setIsInstalled(true)
      return
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setIsInstallable(false)
      setDeferredPrompt(null)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      setDeferredPrompt(null)
      setIsInstallable(false)
    }
  }

  // Always render the button but visually hidden or disabled? 
  // No, the requirements say: "If installed: Hide install button automatically."
  if (isInstalled || !isInstallable) {
    return null
  }

  if (variant === "sidebar") {
    return (
      <button 
        onClick={handleInstallClick}
        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 transition-colors w-full font-medium text-sm ${className}`}
      >
        <Download className="h-4 w-4" />
        Get App
      </button>
    )
  }

  return (
    <Button 
      onClick={handleInstallClick} 
      variant="outline" 
      size="sm" 
      className={`border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 hover:text-indigo-100 ${className}`}
    >
      <Download className="h-4 w-4 mr-2" />
      Get App
    </Button>
  )
}
