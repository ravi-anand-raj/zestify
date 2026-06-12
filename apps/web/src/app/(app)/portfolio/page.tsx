"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, ChartPie as PieChartIcon, Activity, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { PageHeader } from "@/components/shared/PageHeader"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { useState, useEffect } from "react"

const holdings = [
  { ticker: "VOO", name: "Vanguard S&P 500 ETF", value: 56052.90, costBasis: 40542.00, allocation: 45.0, trend: "+38.3%" },
  { ticker: "AAPL", name: "Apple Inc.", value: 43596.70, costBasis: 29559.00, allocation: 35.0, trend: "+47.5%" },
  { ticker: "CASH", name: "Premier Checking", value: 12456.20, costBasis: 12456.20, allocation: 10.0, trend: "+0.0%" },
  { ticker: "RELIANCE", name: "Reliance Industries", value: 8900.00, costBasis: 7500.00, allocation: 7.2, trend: "+18.7%" },
  { ticker: "GOLDBEES", name: "Nippon India ETF Gold BeES", value: 3456.00, costBasis: 3200.00, allocation: 2.8, trend: "+8.0%" },
]

const totalAssets = holdings.reduce((sum, h) => sum + h.value, 0)
const totalGain = holdings.reduce((sum, h) => sum + (h.value - h.costBasis), 0)
const totalReturnPct = ((totalGain / (totalAssets - totalGain)) * 100).toFixed(1)

const allocationData = [
  { name: "Equities", value: 87.2, color: "#0A84FF" },
  { name: "Cash", value: 10.0, color: "#30D158" },
  { name: "Gold", value: 2.8, color: "#FF9F0A" },
]

const diversification = [
  { name: "US Equities", pct: 80, color: "bg-primary" },
  { name: "Indian Equities", pct: 7.2, color: "bg-blue-400" },
  { name: "Cash & Equivalents", pct: 10, color: "bg-accent" },
  { name: "Gold", pct: 2.8, color: "bg-warning" },
]

const metrics = [
  { title: "Total Assets", value: `₹${totalAssets.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`, color: "" },
  { title: "1Y Return", value: `+${totalReturnPct}%`, color: "text-accent" },
  { title: "Risk Profile", value: "Moderate", color: "text-warning" },
  { title: "Est. Yield", value: "₹3,420 / yr", color: "text-primary" },
]

export default function PortfolioPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader
        icon={Wallet}
        title="Portfolio Intelligence"
        description="Deep analysis of your linked assets and allocation."
      />

      {/* Metrics */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {metrics.map((m, i) => (
          <Card key={m.title} className="animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs sm:text-sm text-muted-foreground font-medium">{m.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-xl sm:text-3xl font-bold ${m.color}`}>{m.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Holdings + Allocation */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Holdings List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-base">
                  <PieChartIcon className="h-4 w-4 text-primary" />
                  Holdings Breakdown
                </CardTitle>
                <CardDescription>Assets across all linked institutions.</CardDescription>
              </div>
              <Badge variant="outline">{holdings.length} assets</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {holdings.map((h, i) => {
              const isGain = h.value >= h.costBasis
              return (
                <div
                  key={h.ticker}
                  className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.05] hover:border-white/[0.08] transition-all duration-200 group cursor-pointer animate-slide-up"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-gradient-to-tr from-white/[0.06] to-white/[0.03] flex items-center justify-center font-bold text-[10px] sm:text-xs border border-white/[0.06] shrink-0 group-hover:border-white/[0.1] transition-colors">
                      {h.ticker}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{h.name}</p>
                      <p className="text-xs text-muted-foreground">{h.allocation}% allocation</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-semibold text-sm">₹{h.value.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
                    <p className={`text-xs flex items-center justify-end gap-0.5 ${isGain ? "text-accent" : "text-destructive"}`}>
                      {isGain ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {h.trend}
                    </p>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Allocation Analysis */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="h-4 w-4 text-accent" />
              Diversification
            </CardTitle>
            <CardDescription>ZUST AI Assessment</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-5">
            {/* Donut Chart */}
            <div className="h-[160px] w-full">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={allocationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={2}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {allocationData.map((entry, index) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1C1C1E",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "12px",
                        fontSize: "12px",
                      }}
                      formatter={(value: number) => [`${value}%`, ""]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Breakdown bars */}
            <div className="space-y-3">
              {diversification.map((d) => (
                <div key={d.name} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{d.name}</span>
                    <span className="font-medium">{d.pct}%</span>
                  </div>
                  <Progress value={d.pct} className="h-1.5" />
                </div>
              ))}
            </div>

            {/* AI Insight */}
            <div className="p-3 bg-primary/[0.06] border border-primary/20 rounded-xl">
              <p className="text-xs font-semibold text-primary mb-1">ZUST AI Insight</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Heavy equity concentration (87%). Consider increasing fixed-income exposure if your horizon is under 5 years.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
