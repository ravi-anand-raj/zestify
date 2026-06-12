"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calculator, Play, Shield, Zap, Flame } from "lucide-react"
import { PageHeader } from "@/components/shared/PageHeader"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const presets = [
  { label: "Conservative", rate: "5", icon: Shield, color: "text-blue-400" },
  { label: "Moderate", rate: "8", icon: Zap, color: "text-primary" },
  { label: "Aggressive", rate: "12", icon: Flame, color: "text-accent" },
]

function calculateProjection(initial: number, monthly: number, years: number, rate: number) {
  const r = rate / 100 / 12
  const n = years * 12
  const data = []

  let currentValue = initial
  let totalInvested = initial

  for (let year = 0; year <= years; year++) {
    data.push({
      year: `Yr ${year}`,
      value: Math.round(currentValue),
      invested: Math.round(totalInvested),
    })
    if (year < years) {
      for (let m = 0; m < 12; m++) {
        currentValue = currentValue * (1 + r) + monthly
        totalInvested += monthly
      }
    }
  }

  const finalValue = currentValue
  const totalInvestedFinal = totalInvested
  const wealthGained = finalValue - totalInvestedFinal

  return { data, finalValue, totalInvestedFinal, wealthGained }
}

export default function SimulatorPage() {
  const [initialAmount, setInitialAmount] = useState("50000")
  const [monthlyContribution, setMonthlyContribution] = useState("1000")
  const [years, setYears] = useState("15")
  const [returnRate, setReturnRate] = useState("8")
  const [showResults, setShowResults] = useState(false)

  const result = useMemo(() => {
    const P = parseFloat(initialAmount) || 0
    const PMT = parseFloat(monthlyContribution) || 0
    const Y = parseFloat(years) || 0
    const R = parseFloat(returnRate) || 0

    if (P <= 0 || Y <= 0 || R <= 0) return null

    return calculateProjection(P, PMT, Y, R)
  }, [initialAmount, monthlyContribution, years, returnRate])

  useEffect(() => {
    if (result) setShowResults(true)
  }, [result])

  const totalInvested = (parseFloat(initialAmount) || 0) + (parseFloat(monthlyContribution) || 0) * (parseFloat(years) || 0) * 12

  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader
        icon={Calculator}
        title="What-If Simulator"
        description="Run deterministic scenarios against your portfolio."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Parameters */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Parameters</CardTitle>
            <CardDescription>Adjust the variables for your scenario</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Initial Portfolio Value (₹)</Label>
              <Input
                type="number"
                value={initialAmount}
                onChange={(e) => setInitialAmount(e.target.value)}
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label>Monthly SIP Contribution (₹)</Label>
              <Input
                type="number"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(e.target.value)}
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label>Time Horizon (Years)</Label>
              <Input
                type="number"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                min="1"
                max="50"
              />
            </div>
            <div className="space-y-2">
              <Label>Expected Annual Return (%)</Label>
              <Input
                type="number"
                value={returnRate}
                onChange={(e) => setReturnRate(e.target.value)}
                min="0"
                max="50"
                step="0.5"
              />
            </div>

            {/* Presets */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Quick Presets</Label>
              <div className="grid grid-cols-3 gap-2">
                {presets.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => setReturnRate(p.rate)}
                    className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border transition-all text-xs ${
                      returnRate === p.rate
                        ? "bg-primary/10 border-primary/30 text-primary"
                        : "bg-white/[0.02] border-white/[0.06] text-muted-foreground hover:bg-white/[0.05] hover:text-foreground"
                    }`}
                  >
                    <p.icon className={`h-4 w-4 ${returnRate === p.rate ? "text-primary" : p.color}`} />
                    <span className="font-medium">{p.label}</span>
                    <span className="text-[10px]">{p.rate}%</span>
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={() => setShowResults(true)}
              disabled={!result}
              className="w-full mt-2 bg-primary hover:bg-primary/90 text-white"
            >
              <Play className="mr-2 h-4 w-4" />
              Run Simulation
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Projection Results</CardTitle>
                <CardDescription>Compounding growth visualization</CardDescription>
              </div>
              {result && (
                <Badge variant="outline" className="text-accent border-accent/20">
                  {((result.wealthGained / result.totalInvestedFinal) * 100).toFixed(0)}% returns
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            {showResults && result ? (
              <div className="flex-1 flex flex-col space-y-5 animate-fade-in">
                {/* Projected Value */}
                <div className="text-center py-3">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Projected Future Value</p>
                  <h3 className="text-4xl sm:text-5xl font-bold text-accent animate-counter-up">
                    ₹{Math.round(result.finalValue).toLocaleString("en-IN")}
                  </h3>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/[0.02] p-3 sm:p-4 rounded-xl border border-white/[0.06]">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Total Invested</p>
                    <p className="text-lg sm:text-xl font-medium">
                      ₹{Math.round(result.totalInvestedFinal).toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div className="bg-primary/[0.04] p-3 sm:p-4 rounded-xl border border-primary/20">
                    <p className="text-[10px] text-primary uppercase tracking-wider mb-1">Wealth Gained</p>
                    <p className="text-lg sm:text-xl font-medium text-primary">
                      ₹{Math.round(result.wealthGained).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                {/* Growth Chart */}
                <div className="flex-1 min-h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={result.data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="valueGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#0A84FF" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="#0A84FF" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="investedGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#30D158" stopOpacity={0.15} />
                          <stop offset="100%" stopColor="#30D158" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                      <XAxis
                        dataKey="year"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: "rgba(255,255,255,0.4)" }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: "rgba(255,255,255,0.4)" }}
                        tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1C1C1E",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "12px",
                          fontSize: "12px",
                        }}
                        formatter={(value: number, name: string) => [
                          `₹${value.toLocaleString("en-IN")}`,
                          name === "value" ? "Portfolio" : "Invested",
                        ]}
                      />
                      <Area
                        type="monotone"
                        dataKey="invested"
                        stroke="#30D158"
                        strokeWidth={1.5}
                        fill="url(#investedGrad)"
                        strokeDasharray="4 4"
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#0A84FF"
                        strokeWidth={2}
                        fill="url(#valueGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground py-12">
                <Calculator className="h-14 w-14 mb-4 opacity-15" />
                <p className="text-sm">Adjust parameters and run the simulation to view projections.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
