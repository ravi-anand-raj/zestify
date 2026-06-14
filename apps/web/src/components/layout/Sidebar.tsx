"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Wallet, LineChart, Bot, Route, Target, Calculator, Settings, CreditCard, Menu, X, Newspaper, Globe2 } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { ZestifyLogo } from "@/components/shared/ZestifyLogo"
import { useLanguage } from "@/components/providers/LanguageProvider"
import { InstallPWA } from "@/components/ui/InstallPWA"

export function Sidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { t } = useLanguage()

  const navItems = [
    { name: t.nav.dashboard, href: "/dashboard", icon: LayoutDashboard },
    { name: t.nav.portfolio, href: "/portfolio", icon: Wallet },
    { name: t.nav.watchlist, href: "/watchlist", icon: LineChart },
    { name: t.nav.updates, href: "/updates", icon: Newspaper },
    { name: t.nav.news, href: "/news", icon: Globe2 },
    { name: t.nav.zustAi, href: "/zust-ai", icon: Bot, highlight: true },
    { name: t.nav.roadmap, href: "/roadmap", icon: Route },
    { name: t.nav.goalPlanner, href: "/goals", icon: Target },
    { name: t.nav.simulator, href: "/simulator", icon: Calculator },
  ]

  const bottomItems = [
    { name: t.nav.billing, href: "/billing", icon: CreditCard },
    { name: t.nav.settings, href: "/settings", icon: Settings },
  ]

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-3 py-5">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <ZestifyLogo size="sm" />
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

      <Separator className="mx-3 mb-2 bg-border" />

      {/* Navigation */}
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                aria-current={isActive ? "page" : undefined}
              >
                <span
                  className={cn(
                    "group flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200",
                    isActive
                      ? "bg-primary/10 text-primary dark:bg-primary/10 dark:text-primary"
                      : "text-muted-foreground hover:bg-muted/60 dark:hover:bg-white/[0.04] hover:text-foreground",
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
        <div className="px-3 py-2">
          <InstallPWA variant="sidebar" />
        </div>
        <Separator className="my-2 bg-border" />
        <div className="space-y-0.5">
          {bottomItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                aria-current={isActive ? "page" : undefined}
              >
                <span
                  className={cn(
                    "group flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted/60 dark:hover:bg-white/[0.04] hover:text-foreground"
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
          "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-out lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col h-screen w-60 border-r border-border bg-card/80 dark:bg-card/50 backdrop-blur-xl sticky top-0 shrink-0">
        <SidebarContent />
      </aside>
    </>
  )
}
