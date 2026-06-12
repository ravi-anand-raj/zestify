"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, Plus, MoveHorizontal as MoreHorizontal, Pencil, Trash2, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PageHeader } from "@/components/shared/PageHeader"
import { EmptyState } from "@/components/shared/EmptyState"
import { toast } from "sonner"

type Goal = {
  id: string
  name: string
  type: string
  target: number
  current: number
  date: string
  monthlyContribution: number
}

const initialGoals: Goal[] = [
  { id: "1", name: "Buy a House", type: "HOME_PURCHASE", target: 150000, current: 45000, date: "2028-12-31", monthlyContribution: 2500 },
  { id: "2", name: "Emergency Fund", type: "EMERGENCY_FUND", target: 20000, current: 18500, date: "2026-08-01", monthlyContribution: 500 },
  { id: "3", name: "New Car", type: "CAR_PURCHASE", target: 35000, current: 5000, date: "2027-05-15", monthlyContribution: 1200 },
]

const goalTypes = [
  { value: "EMERGENCY_FUND", label: "Emergency Fund" },
  { value: "HOME_PURCHASE", label: "Home Purchase" },
  { value: "CAR_PURCHASE", label: "Car Purchase" },
  { value: "RETIREMENT", label: "Retirement" },
  { value: "EDUCATION", label: "Education" },
  { value: "VACATION", label: "Vacation" },
  { value: "WEALTH_BUILDING", label: "Wealth Building" },
  { value: "CUSTOM", label: "Custom" },
]

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>(initialGoals)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)

  // Form state
  const [name, setName] = useState("")
  const [type, setType] = useState("CUSTOM")
  const [target, setTarget] = useState("")
  const [date, setDate] = useState("")
  const [monthly, setMonthly] = useState("")

  const resetForm = () => {
    setName("")
    setType("CUSTOM")
    setTarget("")
    setDate("")
    setMonthly("")
    setEditingGoal(null)
  }

  const handleCreate = () => {
    if (!name || !target || !date) return

    const goal: Goal = {
      id: Date.now().toString(),
      name,
      type,
      target: parseFloat(target),
      current: 0,
      date,
      monthlyContribution: parseFloat(monthly) || 0,
    }
    setGoals(prev => [...prev, goal])
    resetForm()
    setDialogOpen(false)
    toast.success("Goal created successfully")
  }

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal)
    setName(goal.name)
    setType(goal.type)
    setTarget(goal.target.toString())
    setDate(goal.date)
    setMonthly(goal.monthlyContribution.toString())
    setDialogOpen(true)
  }

  const handleUpdate = () => {
    if (!editingGoal || !name || !target || !date) return

    setGoals(prev =>
      prev.map(g =>
        g.id === editingGoal.id
          ? { ...g, name, type, target: parseFloat(target), date, monthlyContribution: parseFloat(monthly) || 0 }
          : g
      )
    )
    resetForm()
    setDialogOpen(false)
    toast.success("Goal updated")
  }

  const handleDelete = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id))
    toast.success("Goal deleted")
  }

  if (goals.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader icon={Target} title="Goal Planner" description="Track and forecast your financial objectives.">
          <Button onClick={() => { resetForm(); setDialogOpen(true) }} className="bg-primary hover:bg-primary/90 text-white rounded-full px-5">
            <Plus className="h-4 w-4 mr-2" />
            Create Goal
          </Button>
        </PageHeader>
        <EmptyState
          icon={Target}
          title="No goals yet"
          description="Set your first financial goal to start tracking your progress toward wealth building."
          action={{ label: "Create Goal", onClick: () => { resetForm(); setDialogOpen(true) } }}
        />
        <GoalDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          editing={editingGoal}
          name={name} setName={setName}
          type={type} setType={setType}
          target={target} setTarget={setTarget}
          date={date} setDate={setDate}
          monthly={monthly} setMonthly={setMonthly}
          onSubmit={editingGoal ? handleUpdate : handleCreate}
          onReset={resetForm}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader icon={Target} title="Goal Planner" description="Track and forecast your financial objectives.">
        <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) resetForm(); setDialogOpen(open) }}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-primary hover:bg-primary/90 text-white rounded-full px-5">
              <Plus className="h-4 w-4 mr-2" />
              Create Goal
            </Button>
          </DialogTrigger>
          <GoalDialogContent
            editing={editingGoal}
            name={name} setName={setName}
            type={type} setType={setType}
            target={target} setTarget={setTarget}
            date={date} setDate={setDate}
            monthly={monthly} setMonthly={setMonthly}
            onSubmit={editingGoal ? handleUpdate : handleCreate}
          />
        </Dialog>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal, i) => {
          const progress = (goal.current / goal.target) * 100
          const isComplete = progress >= 100
          const isNearComplete = progress >= 75 && !isComplete

          return (
            <Card
              key={goal.id}
              className={`relative overflow-hidden group hover:border-white/[0.08] transition-all duration-300 animate-slide-up ${
                isComplete ? "border-accent/20" : isNearComplete ? "border-primary/20" : ""
              }`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="absolute top-0 right-0 flex items-center gap-2 p-3">
                {isComplete && (
                  <Badge variant="success" className="text-[10px]">ACHIEVED</Badge>
                )}
                {isNearComplete && (
                  <Badge variant="default" className="text-[10px]">Almost there</Badge>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(goal)}>
                      <Pencil className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(goal.id)} className="text-destructive focus:text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(goal.date).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}
                </div>
                <CardTitle className="text-lg">{goal.name}</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-2xl sm:text-3xl font-bold">₹{goal.current.toLocaleString("en-IN")}</p>
                    <p className="text-xs text-muted-foreground">of ₹{goal.target.toLocaleString("en-IN")}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-semibold ${isComplete ? "text-accent" : "text-primary"}`}>
                      {progress.toFixed(0)}%
                    </p>
                  </div>
                </div>

                <Progress value={Math.min(progress, 100)} className={isComplete ? "[&>div]:bg-accent" : ""} />

                {goal.monthlyContribution > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Contributing ₹{goal.monthlyContribution.toLocaleString("en-IN")}/month
                  </p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

function GoalDialog({ open, onOpenChange, editing, name, setName, type, setType, target, setTarget, date, setDate, monthly, setMonthly, onSubmit, onReset }: {
  open: boolean
  onOpenChange: (open: boolean) => void
  editing: Goal | null
  name: string; setName: (v: string) => void
  type: string; setType: (v: string) => void
  target: string; setTarget: (v: string) => void
  date: string; setDate: (v: string) => void
  monthly: string; setMonthly: (v: string) => void
  onSubmit: () => void
  onReset: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onReset(); onOpenChange(v) }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Goal" : "Create Goal"}</DialogTitle>
          <DialogDescription>{editing ? "Update your goal details." : "Set a new financial target to track."}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Goal Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Buy a House" />
          </div>
          <div className="space-y-2">
            <Label>Goal Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {goalTypes.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Target Amount (₹)</Label>
              <Input type="number" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="150000" min="0" />
            </div>
            <div className="space-y-2">
              <Label>Monthly Contribution (₹)</Label>
              <Input type="number" value={monthly} onChange={(e) => setMonthly(e.target.value)} placeholder="2500" min="0" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Target Date</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onReset}>Cancel</Button>
          <Button onClick={onSubmit} className="bg-primary hover:bg-primary/90 text-white">
            {editing ? "Update Goal" : "Create Goal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function GoalDialogContent({ editing, name, setName, type, setType, target, setTarget, date, setDate, monthly, setMonthly, onSubmit }: {
  editing: Goal | null
  name: string; setName: (v: string) => void
  type: string; setType: (v: string) => void
  target: string; setTarget: (v: string) => void
  date: string; setDate: (v: string) => void
  monthly: string; setMonthly: (v: string) => void
  onSubmit: () => void
}) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{editing ? "Edit Goal" : "Create Goal"}</DialogTitle>
        <DialogDescription>{editing ? "Update your goal details." : "Set a new financial target to track."}</DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-2">
        <div className="space-y-2">
          <Label>Goal Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Buy a House" />
        </div>
        <div className="space-y-2">
          <Label>Goal Type</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {goalTypes.map((t) => (
                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Target Amount (₹)</Label>
            <Input type="number" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="150000" min="0" />
          </div>
          <div className="space-y-2">
            <Label>Monthly Contribution (₹)</Label>
            <Input type="number" value={monthly} onChange={(e) => setMonthly(e.target.value)} placeholder="2500" min="0" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Target Date</Label>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
      </div>
      <DialogFooter>
        <Button onClick={onSubmit} className="bg-primary hover:bg-primary/90 text-white">
          {editing ? "Update Goal" : "Create Goal"}
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
