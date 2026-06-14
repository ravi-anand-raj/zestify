"use client"

import { Bell, Search, LogOut, User, Settings, Circle as HelpCircle } from "lucide-react"
import { usePathname } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { InstallPWA } from "@/components/ui/InstallPWA"
import { signOut, useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/components/providers/LanguageProvider"
import { CommandMenu } from "@/components/layout/CommandMenu"

export function Topbar() {
  const pathname = usePathname()
  const { t } = useLanguage()
  const { data: session } = useSession()

  const pageTitles: Record<string, string> = {
    "/dashboard": t.pages.overview,
    "/portfolio": t.pages.portfolioIntelligence,
    "/watchlist": t.pages.watchlistIntelligence,
    "/updates": t.pages.financeUpdates,
    "/news": t.pages.newsHub,
    "/zust-ai": t.pages.zustAiCopilot,
    "/roadmap": t.pages.wealthRoadmap,
    "/goals": t.pages.goalPlanner,
    "/simulator": t.pages.whatIfSimulator,
    "/billing": t.pages.billingSubscription,
    "/settings": t.pages.settings,
    "/profile": t.pages.profile,
  }

  const notifications = [
    {
      id: "1",
      title: "AAPL Earnings Update",
      body: "Apple beat Q3 estimates by 12%. View analysis.",
      time: "2m ago",
      type: "market_update" as const,
      read: false,
    },
    {
      id: "2",
      title: "Hidden Fee Detected",
      body: "Your Vanguard Mutual Fund charges 1.2%. Consider switching.",
      time: "15m ago",
      type: "ai_insight" as const,
      read: false,
    },
    {
      id: "3",
      title: "Goal Milestone",
      body: "Emergency Fund is 92% complete. Keep going!",
      time: "1h ago",
      type: "goal_milestone" as const,
      read: true,
    },
  ]

  const pageTitle = (pathname && pageTitles[pathname]) || ""
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border bg-background/80 dark:bg-background/80 backdrop-blur-xl px-4 lg:px-6">
      {/* Page Title */}
      <div className="flex-1 flex items-center gap-3 pl-12 lg:pl-0">
        {pageTitle && (
          <h1 className="text-sm font-semibold text-foreground hidden sm:block">
            {pageTitle}
          </h1>
        )}
      </div>

      <InstallPWA />

      {/* Search Command Palette */}
      <CommandMenu />

      {/* Notifications */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 dark:hover:bg-white/[0.06]"
            aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
          >
            <Bell className="h-[18px] w-[18px]" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="end">
          <div className="flex items-center justify-between px-4 py-3">
            <h4 className="text-sm font-semibold">{t.settings.notifications}</h4>
            <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-primary hover:text-primary/80">
              Mark all read
            </Button>
          </div>
          <Separator />
          <ScrollArea className="h-[280px]">
            <div className="flex flex-col">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={cn(
                    "flex flex-col gap-1 px-4 py-3 transition-colors hover:bg-muted/50 dark:hover:bg-white/[0.03] cursor-pointer",
                    !n.read && "bg-primary/[0.04] dark:bg-primary/[0.03]"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{n.title}</span>
                    {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{n.body}</p>
                  <span className="text-[10px] text-muted-foreground">{n.time}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>

      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0 hover:bg-muted/60 dark:hover:bg-white/[0.06]" aria-label="User menu">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                {session?.user?.name ? session.user.name.substring(0, 2).toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{session?.user?.name || "User"}</p>
              <p className="text-xs text-muted-foreground">{session?.user?.email || ""}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <a href="/profile" className="flex items-center cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                {t.nav.profile}
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/settings" className="flex items-center cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                {t.nav.settings}
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <HelpCircle className="mr-2 h-4 w-4" />
              Help & Support
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer text-destructive focus:text-destructive"
            onSelect={() => signOut({ callbackUrl: "/login" })}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {t.common.logOut}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
