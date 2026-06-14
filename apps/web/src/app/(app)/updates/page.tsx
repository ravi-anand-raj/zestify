"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import {
  Bot,
  Briefcase,
  CircleAlert,
  ExternalLink,
  Newspaper,
  RefreshCw,
  TrendingUp,
  Wallet,
} from "lucide-react"
import { PageHeader } from "@/components/shared/PageHeader"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Topic = "market" | "business" | "personal" | "watchlist"

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

const topics: Array<{ value: Topic; label: string; icon: typeof TrendingUp }> = [
  { value: "market", label: "Market", icon: TrendingUp },
  { value: "business", label: "Business", icon: Briefcase },
  { value: "personal", label: "Personal Finance", icon: Wallet },
  { value: "watchlist", label: "Watchlist", icon: Bot },
]

const beginnerActions = [
  {
    title: "Separate signal from noise",
    body: "Check whether a headline changes cash flow, rates, earnings, or only sentiment.",
    prompt: "Explain this market update for a beginner investor",
  },
  {
    title: "Check position size",
    body: "Before acting on news, confirm no single stock dominates your portfolio.",
    prompt: "Help me review my portfolio concentration risk",
  },
  {
    title: "Compare fees first",
    body: "Lower recurring fees can matter more than one short-term market move.",
    prompt: "How do I compare mutual fund and ETF expense ratios?",
  },
]

export default function UpdatesPage() {
  const [topic, setTopic] = useState<Topic>("market")
  const [updates, setUpdates] = useState<FinanceUpdate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadUpdates = useCallback(async (selectedTopic: Topic) => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/finance/updates?topic=${selectedTopic}&limit=10`, {
        cache: "no-store",
      })

      if (!res.ok) throw new Error("Unable to load updates")

      const payload = await res.json()
      setUpdates(Array.isArray(payload.data) ? payload.data : [])
    } catch {
      setError("Live updates are unavailable right now. Try refreshing in a moment.")
      setUpdates([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadUpdates(topic)
  }, [loadUpdates, topic])

  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader
        icon={Newspaper}
        title="Finance & Business Updates"
        description="Live market context with beginner-friendly next actions."
      >
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground gap-2"
          onClick={() => loadUpdates(topic)}
          disabled={loading}
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      </PageHeader>

      <Tabs value={topic} onValueChange={(value) => setTopic(value as Topic)}>
        <TabsList className="w-full justify-start overflow-x-auto sm:w-auto">
          {topics.map((item) => {
            const Icon = item.icon
            return (
              <TabsTrigger key={item.value} value={item.value} className="gap-2">
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </TabsTrigger>
            )
          })}
        </TabsList>
      </Tabs>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-3">
          {loading && (
            <>
              <Skeleton className="h-32 w-full bg-muted/60" />
              <Skeleton className="h-32 w-full bg-muted/60" />
              <Skeleton className="h-32 w-full bg-muted/60" />
            </>
          )}

          {!loading && error && (
            <div className="rounded-xl border border-destructive/20 bg-destructive/[0.06] p-4 text-sm text-destructive flex items-start gap-2">
              <CircleAlert className="h-4 w-4 mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          {!loading && !error && updates.length === 0 && (
            <div className="rounded-xl border border-border bg-card p-6 text-center">
              <Newspaper className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <p className="font-medium">No live updates returned for this filter.</p>
              <p className="text-sm text-muted-foreground mt-1">Refresh or switch to another topic.</p>
            </div>
          )}

          {!loading &&
            !error &&
            updates.map((item, index) => (
              <Card
                key={item.id}
                className="group hover:bg-muted/30 dark:hover:bg-white/[0.03] hover:border-border transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 45}ms` }}
              >
                <CardHeader className="pb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{item.category}</Badge>
                    {item.relatedSymbol && <Badge variant="success">{item.relatedSymbol}</Badge>}
                    <span className="text-xs text-muted-foreground">{formatTime(item.publishedAt)}</span>
                  </div>
                  <CardTitle className="text-base leading-relaxed group-hover:text-primary transition-colors">
                    {item.title}
                  </CardTitle>
                  <CardDescription>{item.publisher}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.summary || "Open the source or ask ZUST AI to turn this update into portfolio context."}
                  </p>
                  <div className="flex shrink-0 gap-2">
                    <Button asChild variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                      <a href={item.link} target="_blank" rel="noreferrer">
                        <ExternalLink className="h-3.5 w-3.5" />
                        Source
                      </a>
                    </Button>
                    <Button asChild size="sm" className="gap-2">
                      <Link href={`/zust-ai?q=${encodeURIComponent(item.relatedSymbol || item.title)}`}>
                        <Bot className="h-3.5 w-3.5" />
                        Ask ZUST AI
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Beginner Playbook
              </CardTitle>
              <CardDescription>Simple actions before reacting to news.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {beginnerActions.map((action) => (
                <div key={action.title} className="rounded-xl border border-border bg-muted/30 p-3">
                  <p className="text-sm font-medium">{action.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{action.body}</p>
                  <Button asChild variant="ghost" size="sm" className="mt-2 h-8 px-0 text-primary hover:text-primary/80">
                    <Link href={`/zust-ai?q=${encodeURIComponent(action.prompt)}`}>Ask ZUST AI</Link>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/[0.03]">
            <CardHeader>
              <CardTitle className="text-base">Basic Intelligence Mode</CardTitle>
              <CardDescription>
                Works without a paid AI key by combining live Yahoo Finance data with deterministic finance rules.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  )
}

function formatTime(value?: string) {
  if (!value) return "Latest"

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "Latest"

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date)
}
