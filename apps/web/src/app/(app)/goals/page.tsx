"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function GoalsPage() {
  const goals = [
    { id: 1, name: "Buy a House", target: 150000, current: 45000, date: "2028-12-31" },
    { id: 2, name: "Emergency Fund", target: 20000, current: 18500, date: "2026-08-01" },
    { id: 3, name: "New Car", target: 35000, current: 5000, date: "2027-05-15" }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Target className="h-8 w-8 text-primary" />
            Goal Planner
          </h2>
          <p className="text-muted-foreground mt-1">Track and forecast your financial objectives.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-6">
          <Plus className="h-4 w-4 mr-2" />
          Create Goal
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal) => {
          const progress = (goal.current / goal.target) * 100
          const isComplete = progress >= 100
          
          return (
            <Card key={goal.id} className="bg-black/40 border-white/5 relative overflow-hidden group hover:border-white/20 transition-colors">
              {isComplete && (
                <div className="absolute top-0 right-0 bg-accent text-black text-[10px] font-bold px-3 py-1 rounded-bl-lg">
                  ACHIEVED
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl">{goal.name}</CardTitle>
                <CardDescription>Target Date: {new Date(goal.date).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-3xl font-bold text-white">₹{goal.current.toLocaleString('en-IN')}</p>
                    <p className="text-sm text-muted-foreground">of ₹{goal.target.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-medium text-primary">{progress.toFixed(1)}%</p>
                  </div>
                </div>
                
                <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${isComplete ? 'bg-accent' : 'bg-primary'}`} 
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
