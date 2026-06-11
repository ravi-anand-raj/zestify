"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Route, CheckCircle2, Circle, Clock } from "lucide-react"

export default function RoadmapPage() {
  const phases = [
    { id: 1, name: "Emergency Fund", description: "Save 3-6 months of living expenses.", status: "completed", date: "Jan 2025" },
    { id: 2, name: "Debt Annihilation", description: "Clear all high-interest consumer debt (>7% APY).", status: "completed", date: "Jun 2025" },
    { id: 3, name: "Base Accumulation", description: "Reach first ₹100k invested in core index funds.", status: "in-progress", date: "Expected: Dec 2026" },
    { id: 4, name: "Wealth Acceleration", description: "Diversify into real estate and alternative assets.", status: "pending", date: "Future" },
    { id: 5, name: "Financial Independence", description: "Passive income exceeds monthly burn rate.", status: "pending", date: "Future" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Route className="h-8 w-8 text-primary" />
            Wealth Roadmap
          </h2>
          <p className="text-muted-foreground mt-1">Your step-by-step path to Financial Independence.</p>
        </div>
      </div>

      <div className="max-w-3xl">
        <Card className="bg-black/40 border-white/5">
          <CardHeader>
            <CardTitle>ZUST AI Generated Path</CardTitle>
            <CardDescription>Based on your current cash flow and asset base.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 pl-8">
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[1.4rem] before:w-0.5 before:bg-gradient-to-b before:from-primary before:via-white/20 before:to-transparent">
              {phases.map((phase, index) => (
                <div key={phase.id} className="relative flex items-start gap-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-background border border-white/10 z-10 shrink-0">
                    {phase.status === "completed" ? (
                      <CheckCircle2 className="h-6 w-6 text-accent" />
                    ) : phase.status === "in-progress" ? (
                      <Clock className="h-6 w-6 text-primary animate-pulse" />
                    ) : (
                      <Circle className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className={`flex-1 pt-2 ${phase.status === 'pending' ? 'opacity-50' : ''}`}>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`text-lg font-bold ${phase.status === 'completed' ? 'text-accent' : phase.status === 'in-progress' ? 'text-primary' : 'text-white'}`}>
                        Phase {index + 1}: {phase.name}
                      </h3>
                      <span className="text-xs font-medium text-muted-foreground px-2 py-1 bg-white/5 rounded-md">
                        {phase.date}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">{phase.description}</p>
                    
                    {phase.status === "in-progress" && (
                      <div className="mt-4 p-4 bg-primary/10 border border-primary/20 rounded-xl">
                        <p className="text-xs text-primary uppercase tracking-wider font-semibold mb-2">Current Focus</p>
                        <div className="flex justify-between text-sm mb-2">
                          <span>₹45,000 / ₹100,000</span>
                          <span>45%</span>
                        </div>
                        <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden">
                          <div className="h-full bg-primary w-[45%] rounded-full shadow-[0_0_10px_rgba(10,132,255,0.5)]"></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
