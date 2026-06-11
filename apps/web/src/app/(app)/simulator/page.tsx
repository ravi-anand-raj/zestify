"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Calculator, Play, RefreshCw } from "lucide-react"

export default function SimulatorPage() {
  const [initialAmount, setInitialAmount] = useState("50000")
  const [monthlyContribution, setMonthlyContribution] = useState("1000")
  const [years, setYears] = useState("15")
  const [returnRate, setReturnRate] = useState("7")
  const [running, setRunning] = useState(false)

  const [projectedValue, setProjectedValue] = useState<number | null>(null)

  const runSimulation = () => {
    setRunning(true)
    setTimeout(() => {
      // Basic compound interest formula for SIP
      const P = parseFloat(initialAmount)
      const PMT = parseFloat(monthlyContribution)
      const r = parseFloat(returnRate) / 100 / 12
      const n = parseFloat(years) * 12

      const futureValueP = P * Math.pow(1 + r, n)
      const futureValuePMT = PMT * ((Math.pow(1 + r, n) - 1) / r)
      const total = futureValueP + futureValuePMT

      setProjectedValue(total)
      setRunning(false)
    }, 800)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Calculator className="h-8 w-8 text-primary" />
            What-If Simulator
          </h2>
          <p className="text-muted-foreground mt-1">Run deterministic scenarios against your portfolio.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Parameters</CardTitle>
            <CardDescription>Adjust the variables for your scenario</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Initial Portfolio Value (₹)</Label>
              <Input 
                type="number" 
                value={initialAmount} 
                onChange={(e) => setInitialAmount(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label>Monthly SIP Contribution (₹)</Label>
              <Input 
                type="number" 
                value={monthlyContribution} 
                onChange={(e) => setMonthlyContribution(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label>Time Horizon (Years)</Label>
              <Input 
                type="number" 
                value={years} 
                onChange={(e) => setYears(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label>Expected Annual Return (%)</Label>
              <Input 
                type="number" 
                value={returnRate} 
                onChange={(e) => setReturnRate(e.target.value)} 
              />
            </div>

            <Button onClick={runSimulation} disabled={running} className="w-full mt-4 bg-primary text-white">
              {running ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
              {running ? "Simulating..." : "Run Simulation"}
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 flex flex-col">
          <CardHeader>
            <CardTitle>Projection Results</CardTitle>
            <CardDescription>Monte Carlo averages and compounding visualization</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center p-6 border-t border-white/5 bg-black/20">
            {projectedValue ? (
              <div className="text-center space-y-4 animate-in fade-in zoom-in duration-500">
                <p className="text-muted-foreground text-lg">Projected Future Value</p>
                <h3 className="text-6xl font-bold text-accent">
                  ₹{projectedValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h3>
                <div className="flex justify-center gap-6 mt-8">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Invested</p>
                    <p className="text-xl font-medium text-white">
                      ₹{(parseFloat(initialAmount) + (parseFloat(monthlyContribution) * parseFloat(years) * 12)).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="bg-primary/10 p-4 rounded-xl border border-primary/20">
                    <p className="text-xs text-primary uppercase tracking-wider mb-1">Total Wealth Gained</p>
                    <p className="text-xl font-medium text-primary">
                      ₹{(projectedValue - (parseFloat(initialAmount) + (parseFloat(monthlyContribution) * parseFloat(years) * 12))).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <Calculator className="h-16 w-16 mx-auto mb-4 opacity-20" />
                <p>Adjust parameters and click Run Simulation to view projections.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
