"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Route, CircleCheck as CheckCircle2, Circle, Clock, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { PageHeader } from "@/components/shared/PageHeader"

const phases = [
  { id: 1, name: "Emergency Fund", description: "Save 3-6 months of living expenses in a liquid savings account.", status: "completed" as const, date: "Jan 2025" },
  { id: 2, name: "Debt Annihilation", description: "Clear all high-interest consumer debt above 7% APY.", status: "completed" as const, date: "Jun 2025" },
  { id: 3, name: "Base Accumulation", description: "Reach first ₹100k invested in core index funds and start building momentum.", status: "in-progress" as const, date: "Expected: Dec 2026" },
  { id: 4, name: "Wealth Acceleration", description: "Diversify into real estate, alternative assets, and international markets.", status: "pending" as const, date: "Future" },
  { id: 5, name: "Financial Independence", description: "Passive income from investments exceeds monthly living expenses.", status: "pending" as const, date: "Future" },
]

const statusConfig = {
  completed: { icon: CheckCircle2, color: "text-accent", bg: "bg-accent/10 border-accent/20" },
  "in-progress": { icon: Clock, color: "text-primary", bg: "bg-primary/10 border-primary/20" },
  pending: { icon: Circle, color: "text-muted-foreground", bg: "bg-white/[0.02] border-white/[0.06]" },
}

const statusBadge = {
  completed: { label: "Completed", variant: "success" as const },
  "in-progress": { label: "In Progress", variant: "default" as const },
  pending: { label: "Upcoming", variant: "outline" as const },
}

export default function RoadmapPage() {
  return (
    <div className="space-y-6 max-w-[1000px]">
      <PageHeader icon={Route} title="Wealth Roadmap" description="Your step-by-step path to Financial Independence.">
        <Button variant="outline" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
          <RefreshCw className="h-3.5 w-3.5" />
          Regenerate
        </Button>
      </PageHeader>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">ZUST AI Generated Path</CardTitle>
              <CardDescription>Based on your current cash flow and asset base.</CardDescription>
            </div>
            <Badge variant="outline">2 of 5 complete</Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-2 pb-6">
          <div className="space-y-0 relative">
            {/* Timeline line */}
            <div className="absolute left-[23px] top-0 bottom-0 w-px bg-gradient-to-b from-accent via-primary/40 to-white/[0.06]" />

            {phases.map((phase, index) => {
              const config = statusConfig[phase.status]
              const Icon = config.icon

              return (
                <div
                  key={phase.id}
                  className={`relative flex items-start gap-5 py-5 animate-slide-up ${phase.status === "pending" ? "opacity-50" : ""}`}
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  {/* Timeline dot */}
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full border shrink-0 z-10 ${config.bg}`}>
                    <Icon className={`h-5 w-5 ${config.color} ${phase.status === "in-progress" ? "animate-pulse" : ""}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className={`text-base font-semibold ${
                        phase.status === "completed" ? "text-accent" : phase.status === "in-progress" ? "text-primary" : "text-foreground"
                      }`}>
                        Phase {index + 1}: {phase.name}
                      </h3>
                      <Badge variant={statusBadge[phase.status].variant} className="text-[10px] shrink-0">
                        {statusBadge[phase.status].label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-1">{phase.description}</p>
                    <p className="text-xs text-muted-foreground">{phase.date}</p>

                    {phase.status === "in-progress" && (
                      <div className="mt-3 p-3 bg-primary/[0.06] border border-primary/20 rounded-xl">
                        <p className="text-[10px] text-primary uppercase tracking-wider font-semibold mb-2">Current Progress</p>
                        <div className="flex justify-between text-xs mb-2">
                          <span>₹45,000 / ₹100,000</span>
                          <span className="font-medium">45%</span>
                        </div>
                        <Progress value={45} className="h-2" />
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
