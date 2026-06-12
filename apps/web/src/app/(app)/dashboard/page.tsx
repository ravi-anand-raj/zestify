"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, TrendingUp, Wallet, ShieldAlert, Zap, Bot, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/shared/PageHeader"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useState, useEffect } from "react"

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
    title: "Hidden Fee Detected",
    body: "Your Vanguard Mutual Fund charges 1.2%. ETF VOO is identical at 0.03%.",
    variant: "warning" as const,
    time: "2m ago",
  },
  {
    id: "2",
    icon: TrendingUp,
    title: "AAPL Earnings Update",
    body: "Apple beat Q3 estimates by 12%. Probability of positive short-term momentum: 72%.",
    variant: "accent" as const,
    time: "15m ago",
  },
  {
    id: "3",
    icon: Zap,
    title: "Rebalancing Suggested",
    body: "Your equity allocation has drifted to 82%. Consider rebalancing to 75%.",
    variant: "primary" as const,
    time: "1h ago",
  },
]

const metrics = [
  {
    title: "Total Net Worth",
    value: "₹1,24,562.20",
    change: "+2.5%",
    trend: "up" as const,
    icon: Wallet,
    color: "text-foreground",
    href: "/portfolio",
  },
  {
    title: "Zest-Score",
    value: "782",
    change: "Top 14%",
    trend: "up" as const,
    icon: Zap,
    color: "text-primary",
    highlight: true,
    href: "/portfolio",
  },
  {
    title: "Monthly Savings",
    value: "₹45,200",
    change: "+8.2%",
    trend: "up" as const,
    icon: TrendingUp,
    color: "text-foreground",
    href: "/goals",
  },
  {
    title: "Active Goals",
    value: "3",
    change: "1 near completion",
    trend: "up" as const,
    icon: Bot,
    color: "text-foreground",
    href: "/goals",
  },
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

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader
        icon={Wallet}
        title="Overview"
        description="Your financial intelligence for today."
      >
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-2">
          <RefreshCw className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      </PageHeader>

      {/* Metric Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, i) => {
          const Icon = metric.icon
          return (
            <a key={metric.title} href={metric.href}>
              <Card
                className={`group hover:bg-white/[0.03] hover:border-white/[0.08] transition-all duration-300 cursor-pointer animate-slide-up ${metric.highlight ? "relative overflow-hidden" : ""}`}
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
                  <Icon className={`h-4 w-4 ${metric.highlight ? "text-primary" : "text-muted-foreground"}`} />
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className={`text-xl sm:text-3xl font-bold ${metric.color}`}>
                    {metric.value}
                  </div>
                  <p className={`text-xs mt-1 flex items-center gap-1 ${metric.trend === "up" ? "text-accent" : "text-destructive"}`}>
                    {metric.trend === "up" ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3" />
                    )}
                    {metric.change}
                  </p>
                </CardContent>
              </Card>
            </a>
          )
        })}
      </div>

      {/* Chart + AI Feed */}
      <div className="grid gap-4 lg:grid-cols-7">
        {/* Wealth Trajectory Chart */}
        <Card className="lg:col-span-5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Wealth Trajectory</CardTitle>
                <CardDescription>Net worth over the last 12 months</CardDescription>
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
                        <stop offset="0%" stopColor="#0A84FF" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#0A84FF" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "rgba(255,255,255,0.4)" }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "rgba(255,255,255,0.4)" }}
                      tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1C1C1E",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "12px",
                        boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
                        fontSize: "12px",
                      }}
                      labelStyle={{ color: "rgba(255,255,255,0.6)" }}
                      itemStyle={{ color: "#0A84FF" }}
                      formatter={(value: number) => [`₹${value.toLocaleString("en-IN")}`, "Net Worth"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#0A84FF"
                      strokeWidth={2}
                      fill="url(#valueGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ZUST AI Feed */}
        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Bot className="h-4 w-4 text-primary" />
              ZUST AI Feed
            </CardTitle>
            <CardDescription>Real-time actionable insights</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-3 pt-0">
            {aiFeedItems.map((item, i) => {
              const Icon = item.icon
              return (
                <div
                  key={item.id}
                  className={`p-3 rounded-xl ${variantStyles[item.variant]} border animate-slide-up`}
                  style={{ animationDelay: `${i * 100}ms`}
                  }
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
              )
            })}
            <a href="/zust-ai">
              <Button variant="ghost" size="sm" className="w-full text-primary hover:text-primary/80 text-xs mt-2">
                View all insights
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
