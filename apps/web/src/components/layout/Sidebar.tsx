"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Wallet, ChartLine as LineChart, Bot, Route, Target, Calculator, Settings, CreditCard, Menu, X, Zap } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Portfolio", href: "/portfolio", icon: Wallet },
  { name: "Watchlist", href: "/watchlist", icon: LineChart },
  { name: "ZUST AI", href: "/zust-ai", icon: Bot, highlight: true },
  { name: "Roadmap", href: "/roadmap", icon: Route },
  { name: "Goal Planner", href: "/goals", icon: Target },
  { name: "Simulator", href: "/simulator", icon: Calculator },
]

const bottomItems = [
  { name: "Billing", href: "/billing", icon: CreditCard },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-3 py-5">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-accent">
            <Zap className="h-5 w-5 text-black" />
          </div>
          <span className="text-xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
            ZESTIFY
          </span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={() => setMobileOpen(false)}
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <Separator className="mx-3 mb-2 bg-white/[0.04]" />

      {/* Navigation */}
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                aria-current={isActive ? "page" : undefined}
              >
                <span
                  className={cn(
                    "group flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground",
                    item.highlight &&
                      !isActive &&
                      "text-primary/80 hover:text-primary"
                  )}
                >
                  <item.icon
                    className={cn(
                      "flex-shrink-0 h-[18px] w-[18px] transition-colors",
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-foreground",
                      item.highlight && !isActive && "text-primary/70"
                    )}
                  />
                  <span className="flex-1">{item.name}</span>
                  {item.highlight && !isActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />
                  )}
                  {isActive && (
                    <span className="h-1 w-6 rounded-full bg-primary" />
                  )}
                </span>
              </Link>
            )
          })}
        </div>
      </ScrollArea>

      {/* Bottom Navigation */}
      <div className="mt-auto px-2 pb-2">
        <Separator className="mb-2 bg-white/[0.04]" />
        <div className="space-y-0.5">
          {bottomItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                aria-current={isActive ? "page" : undefined}
              >
                <span
                  className={cn(
                    "group flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
                  )}
                >
                  <item.icon
                    className={cn(
                      "flex-shrink-0 h-[18px] w-[18px]",
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-foreground"
                    )}
                  />
                  {item.name}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile hamburger */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-3 left-3 z-50 lg:hidden h-10 w-10 text-muted-foreground hover:text-foreground"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-[#0A0A0C] border-r border-white/[0.04] transform transition-transform duration-300 ease-out lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col h-screen w-60 border-r border-white/[0.04] bg-[#0A0A0C]/90 backdrop-blur-xl sticky top-0 shrink-0">
        <SidebarContent />
      </aside>
    </>
  )
}
