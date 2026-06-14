"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Bot,
  ExternalLink,
  Globe,
  Lightbulb,
  Newspaper,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingUp,
  Wallet,
  Zap,
} from "lucide-react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { PageHeader } from "@/components/shared/PageHeader"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useLanguage } from "@/components/providers/LanguageProvider"
import { useTheme } from "@/components/providers/ThemeProvider"

type FinanceUpdate = {
  id: string
  title: string
  publisher: string
  link: string
  category: string
  relatedSymbol?: string
  publishedAt?: string
  summary?: string
}

type MarketIndex = {
  symbol: string
  name: string
  price: number
  currency: string
  changePercent: number
}

const netWorthData = [
  { month: "Jul", value: 85000 },
  { month: "Aug", value: 87500 },
  { month: "Sep", value: 86200 },
  { month: "Oct", value: 91000 },
  { month: "Nov", value: 95800 },
  { month: "Dec", value: 98200 },
  { month: "Jan", value: 101500 },
  { month: "Feb", value: 104200 },
  { month: "Mar", value: 107800 },
  { month: "Apr", value: 109500 },
  { month: "May", value: 113200 },
  { month: "Jun", value: 124562 },
]

const aiFeedItems = [
  {
    id: "1",
    icon: ShieldAlert,
    title: "Fee Review Suggested",
    body: "Compare high-fee funds with lower-cost ETF alternatives before your next contribution.",
    variant: "warning" as const,
    time: "Now",
    query: "How do I compare fund expense ratios as a beginner?",
  },
  {
    id: "2",
    icon: TrendingUp,
    title: "AAPL Watchlist Check",
    body: "Ask ZUST AI for quote, momentum, and recent headline context before changing exposure.",
    variant: "accent" as const,
    time: "Live",
    query: "What is the current outlook for AAPL?",
  },
  {
    id: "3",
    icon: Zap,
    title: "Rebalancing Reminder",
    body: "Equity exposure can drift during rallies. Review target allocation before adding more risk.",
    variant: "primary" as const,
    time: "Today",
    query: "Help me review portfolio allocation and rebalancing basics",
  },
]

const todaySuggestions = [
  {
    title: "Build a simple emergency buffer",
    body: "Keep 3-6 months of core expenses in cash-like instruments before taking more market risk.",
    icon: Wallet,
    query: "Create a beginner emergency fund plan",
  },
  {
    title: "Diversify before optimizing",
    body: "A broad core allocation usually matters more than chasing one stock or one headline.",
    icon: BarChart3,
    query: "Explain diversification for a beginner portfolio",
  },
  {
    title: "Track business quality",
    body: "For any company, check revenue durability, margins, debt, and free cash flow first.",
    icon: Lightbulb,
    query: "How should a beginner analyze business quality?",
  },
]

const quickActions = [
  { label: "Review allocation", href: "/zust-ai?q=Review%20my%20portfolio%20allocation%20for%20beginner%20risk", icon: BarChart3 },
  { label: "Compare fees", href: "/zust-ai?q=How%20do%20I%20compare%20mutual%20fund%20and%20ETF%20fees%3F", icon: ShieldAlert },
  { label: "Market overview", href: "/zust-ai?q=/market", icon: Globe },
  { label: "Learn SIP basics", href: "/zust-ai?q=How%20does%20SIP%20work%20for%20beginners%3F", icon: TrendingUp },
  { label: "Browse news", href: "/news", icon: Newspaper },
  { label: "Check watchlist", href: "/watchlist", icon: Target },
]

const variantStyles = {
  warning: "bg-warning/10 border-warning/20",
  accent: "bg-accent/10 border-accent/20",
  primary: "bg-primary/10 border-primary/20",
}

const iconColorStyles = {
  warning: "text-warning",
  accent: "text-accent",
  primary: "text-primary",
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Good Morning"
  if (hour < 17) return "Good Afternoon"
  return "Good Evening"
}

function AnimatedCounter({ target, prefix = "", suffix = "" }: { target: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const duration = 1200
    const steps = 40
    const increment = target / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [target])

  return (
    <span>
      {prefix}{count.toLocaleString("en-IN")}{suffix}
    </span>
  )
}

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false)
  const [updates, setUpdates] = useState<FinanceUpdate[]>([])
  const [updatesLoading, setUpdatesLoading] = useState(true)
  const [marketIndices, setMarketIndices] = useState<MarketIndex[]>([])
  const [marketLoading, setMarketLoading] = useState(true)
  const { resolvedTheme } = useTheme()
  const { t } = useLanguage()
  const isDark = resolvedTheme === "dark"

  const loadUpdates = useCallback(async () => {
    setUpdatesLoading(true)
    try {
      const res = await fetch("/api/finance/updates?topic=market&limit=4", { cache: "no-store" })
      if (!res.ok) throw new Error("Unable to load updates")
      const payload = await res.json()
      setUpdates(Array.isArray(payload.data) ? payload.data : [])
    } catch {
      setUpdates([])
    } finally {
      setUpdatesLoading(false)
    }
  }, [])

  const loadMarketPulse = useCallback(async () => {
    setMarketLoading(true)
    try {
      // Fetch major market indices via search API
      const symbols = ["^GSPC", "^DJI", "^IXIC", "^NSEI"]
      const results = await Promise.allSettled(
        symbols.map(async (sym) => {
          const res = await fetch(`/api/ai/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              messages: [{ role: "user", content: sym }],
            }),
          })
          return res.json()
        })
      )
      // For now, use static market data as a fallback display
      setMarketIndices([
        { symbol: "S&P 500", name: "S&P 500", price: 5987.43, currency: "USD", changePercent: 0.78 },
        { symbol: "NIFTY", name: "Nifty 50", price: 23568.15, currency: "INR", changePercent: 0.42 },
        { symbol: "NASDAQ", name: "Nasdaq", price: 19432.87, currency: "USD", changePercent: 1.12 },
        { symbol: "DOW", name: "Dow Jones", price: 43876.52, currency: "USD", changePercent: -0.15 },
      ])
    } catch {
      setMarketIndices([])
    } finally {
      setMarketLoading(false)
    }
  }, [])

  useEffect(() => {
    setMounted(true)
    void loadUpdates()
    void loadMarketPulse()
  }, [loadUpdates, loadMarketPulse])

  const metrics = [
    {
      title: t.dashboard.totalNetWorth,
      value: 124562,
      displayValue: "₹1,24,562",
      change: "+2.5%",
      trend: "up" as const,
      icon: Wallet,
      color: "text-foreground",
      href: "/portfolio",
    },
    {
      title: t.dashboard.zestScore,
      value: 782,
      displayValue: "782",
      change: "Top 14%",
      trend: "up" as const,
      icon: Zap,
      color: "text-primary",
      highlight: true,
      href: "/portfolio",
    },
    {
      title: t.dashboard.monthlySavings,
      value: 45200,
      displayValue: "₹45,200",
      change: "+8.2%",
      trend: "up" as const,
      icon: TrendingUp,
      color: "text-foreground",
      href: "/goals",
    },
    {
      title: t.dashboard.activeGoals,
      value: 3,
      displayValue: "3",
      change: "1 near completion",
      trend: "up" as const,
      icon: Target,
      color: "text-foreground",
      href: "/goals",
    },
  ]

  const chartColors = {
    stroke: "#0A84FF",
    grid: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.06)",
    text: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)",
    tooltipBg: isDark ? "#1C1C1E" : "#FFFFFF",
    tooltipBorder: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
    tooltipLabel: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)",
  }

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Hero Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {getGreeting()}, <span className="text-gradient-hero">Investor</span> 👋
          </h1>
          <p className="text-sm text-muted-foreground">
            {t.dashboard.description} · {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="hidden sm:flex items-center gap-1.5 bg-accent/10 text-accent border-accent/20 py-1.5 px-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            Market Open
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground gap-2 border border-border/50"
            onClick={() => { void loadUpdates(); void loadMarketPulse(); }}
            disabled={updatesLoading}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${updatesLoading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">{t.common.refresh}</span>
          </Button>
        </div>
      </div>

      {/* Market Pulse Ticker */}
      {marketIndices.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-border bg-card/50 dark:bg-white/[0.02]">
          <div className="flex items-center gap-1 px-3 py-2 overflow-x-auto scrollbar-hide">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap mr-2 flex items-center gap-1.5">
              <Globe className="h-3 w-3" />
              Market Pulse
            </span>
            <div className="flex items-center gap-4">
              {marketIndices.map((idx) => (
                <Link
                  key={idx.symbol}
                  href={`/zust-ai?q=${encodeURIComponent(idx.symbol)}`}
                  className="flex items-center gap-2 whitespace-nowrap hover:bg-muted/30 dark:hover:bg-white/[0.03] px-2.5 py-1 rounded-lg transition-colors"
                >
                  <span className="text-xs font-semibold">{idx.symbol}</span>
                  <span className="text-xs text-muted-foreground">{idx.price.toLocaleString()}</span>
                  <span className={`text-xs font-medium flex items-center gap-0.5 ${idx.changePercent >= 0 ? "text-accent" : "text-destructive"}`}>
                    {idx.changePercent >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {idx.changePercent >= 0 ? "+" : ""}{idx.changePercent.toFixed(2)}%
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, i) => {
          const Icon = metric.icon
          return (
            <Link key={metric.title} href={metric.href}>
              <Card
                className={`group hover:bg-muted/30 dark:hover:bg-white/[0.03] hover:border-border hover:shadow-card-hover transition-all duration-300 cursor-pointer animate-slide-up ${
                  metric.highlight ? "relative overflow-hidden gradient-border" : ""
                }`}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {metric.highlight && (
                  <div className="absolute top-0 right-0 p-4 opacity-[0.06]">
                    <Icon className="h-20 w-20 text-primary" />
                  </div>
                )}
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                  <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                    {metric.title}
                  </CardTitle>
                  <div className={`p-1.5 rounded-lg ${metric.highlight ? "bg-primary/10" : "bg-muted/50 dark:bg-white/[0.04]"}`}>
                    <Icon className={`h-3.5 w-3.5 ${metric.highlight ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className={`text-xl sm:text-3xl font-bold ${metric.color} metric-value`} style={{ animationDelay: `${i * 100 + 200}ms` }}>
                    {mounted ? metric.displayValue : "..."}
                  </div>
                  <p
                    className={`text-xs mt-1 flex items-center gap-1 ${
                      metric.trend === "up" ? "text-accent" : "text-destructive"
                    }`}
                  >
                    {metric.trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {metric.change}
                  </p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Chart + AI Feed */}
      <div className="grid gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">{t.dashboard.wealthTrajectory}</CardTitle>
                <CardDescription>{t.dashboard.netWorthOverTime}</CardDescription>
              </div>
              <Badge variant="outline" className="text-accent border-accent/20">
                +46.6%
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[280px] sm:h-[320px] w-full">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={netWorthData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="valueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0A84FF" stopOpacity={isDark ? 0.3 : 0.15} />
                        <stop offset="100%" stopColor="#0A84FF" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: chartColors.text }} />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: chartColors.text }}
                      tickFormatter={(v) => `₹${(Number(v) / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: chartColors.tooltipBg,
                        border: `1px solid ${chartColors.tooltipBorder}`,
                        borderRadius: "12px",
                        boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
                        fontSize: "12px",
                      }}
                      labelStyle={{ color: chartColors.tooltipLabel }}
                      itemStyle={{ color: "#0A84FF" }}
                      formatter={(value: number) => [`₹${value.toLocaleString("en-IN")}`, "Net Worth"]}
                    />
                    <Area type="monotone" dataKey="value" stroke="#0A84FF" strokeWidth={2.5} fill="url(#valueGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Bot className="h-4 w-4 text-primary" />
              {t.dashboard.zustAiFeed}
            </CardTitle>
            <CardDescription className="flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent" />
              </span>
              Live intelligence feed
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-3 pt-0">
            {aiFeedItems.map((item, i) => {
              const Icon = item.icon
              return (
                <Link key={item.id} href={`/zust-ai?q=${encodeURIComponent(item.query)}`}>
                  <div
                    className={`p-3 rounded-xl ${variantStyles[item.variant]} border animate-slide-up hover:border-border transition-colors`}
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className="flex items-start gap-2.5">
                      <Icon className={`h-4 w-4 ${iconColorStyles[item.variant]} mt-0.5 shrink-0`} />
                      <div className="min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium truncate">{item.title}</p>
                          <span className="text-[10px] text-muted-foreground whitespace-nowrap">{item.time}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.body}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
            <Button asChild variant="ghost" size="sm" className="w-full text-primary hover:text-primary/80 text-xs mt-2">
              <Link href="/zust-ai">{t.dashboard.viewAllInsights}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* News + Suggestions + Quick Actions */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Market & Business Updates */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Newspaper className="h-4 w-4 text-primary" />
                  Market & Business Updates
                </CardTitle>
                <CardDescription>Live headlines with AI-powered context.</CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm" className="gap-2 text-primary hover:text-primary/80">
                <Link href="/news">View all</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {updatesLoading && (
              <>
                <Skeleton className="h-20 w-full bg-muted/60 rounded-xl" />
                <Skeleton className="h-20 w-full bg-muted/60 rounded-xl" />
              </>
            )}

            {!updatesLoading && updates.length === 0 && (
              <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground text-center">
                <Newspaper className="h-6 w-6 mx-auto mb-2 opacity-30" />
                Live updates are quiet right now. Open the news page or refresh again.
              </div>
            )}

            {!updatesLoading &&
              updates.slice(0, 4).map((item, index) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-border bg-muted/20 dark:bg-white/[0.02] p-3 hover:bg-muted/40 dark:hover:bg-white/[0.04] transition-all duration-200 animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <Badge variant="outline">{item.category}</Badge>
                        {item.relatedSymbol && <Badge variant="success">{item.relatedSymbol}</Badge>}
                        <span className="text-[11px] text-muted-foreground">{item.publisher}</span>
                      </div>
                      <p className="text-sm font-medium leading-relaxed">{item.title}</p>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <Button asChild variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground">
                        <a href={item.link} target="_blank" rel="noreferrer" aria-label="Open source">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </Button>
                      <Button asChild variant="ghost" size="sm" className="h-8 px-2 text-primary hover:text-primary/80">
                        <Link href={`/zust-ai?q=${encodeURIComponent(item.relatedSymbol || item.title)}`}>Analyze</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>

        {/* Right Column */}
        <div className="space-y-4">
          {/* AI Quick Prompts */}
          <Card className="border-accent/20 bg-gradient-to-b from-accent/[0.05] to-transparent">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-accent">
                <Sparkles className="h-4 w-4" />
                AI Quick Prompts
              </CardTitle>
              <CardDescription>Instant insights tailored to today&apos;s market.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {todaySuggestions.map((item) => {
                const Icon = item.icon
                return (
                  <Link key={item.title} href={`/zust-ai?q=${encodeURIComponent(item.query)}`}>
                    <div className="rounded-xl border border-accent/10 bg-card p-3 hover:border-accent/30 hover:shadow-sm transition-all group mb-3 last:mb-0">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                          <Icon className="h-4 w-4 text-accent shrink-0" />
                        </div>
                        <div>
                          <p className="text-sm font-medium group-hover:text-accent transition-colors">{item.title}</p>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.body}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Quick Actions</CardTitle>
              <CardDescription>Fast checks before you act on market information.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              {quickActions.map((action) => {
                const Icon = action.icon
                return (
                  <Button key={action.label} asChild variant="outline" size="sm" className="justify-start text-xs gap-2 h-9">
                    <Link href={action.href}>
                      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                      {action.label}
                    </Link>
                  </Button>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
