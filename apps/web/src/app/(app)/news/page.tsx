"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import {
  Bot,
  Briefcase,
  CircleAlert,
  Cpu,
  ExternalLink,
  Globe,
  Newspaper,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react"
import { PageHeader } from "@/components/shared/PageHeader"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Category = "all" | "market" | "business" | "technology" | "economy"

type NewsItem = {
  id: string
  title: string
  publisher: string
  link: string
  category: string
  relatedSymbol?: string
  publishedAt?: string
  summary?: string
}

const categories: Array<{ value: Category; label: string; icon: typeof TrendingUp }> = [
  { value: "all", label: "All News", icon: Newspaper },
  { value: "market", label: "Market", icon: TrendingUp },
  { value: "business", label: "Business", icon: Briefcase },
  { value: "technology", label: "Technology", icon: Cpu },
  { value: "economy", label: "Economy", icon: Globe },
]

const quickInsights = [
  {
    title: "Don't react to headlines",
    body: "Check if the news changes fundamentals (revenue, rates, policy) before acting on your portfolio.",
    prompt: "How should a beginner separate market noise from actionable signals?",
    icon: Zap,
  },
  {
    title: "Cross-check with data",
    body: "Use ZUST AI to analyze any headline with live market data before making decisions.",
    prompt: "How do I verify if a news headline is relevant to my investments?",
    icon: Sparkles,
  },
  {
    title: "Track sector rotation",
    body: "Money flows between sectors based on economic cycles. Understanding this helps you stay ahead.",
    prompt: "Explain sector rotation and how it affects portfolio allocation",
    icon: TrendingUp,
  },
]

export default function NewsPage() {
  const [category, setCategory] = useState<Category>("all")
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [trendingTickers, setTrendingTickers] = useState<string[]>([])

  const loadNews = useCallback(async (selectedCategory: Category) => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/finance/news?category=${selectedCategory}&limit=8`, {
        cache: "no-store",
      })

      if (!res.ok) throw new Error("Unable to load news")

      const payload = await res.json()
      const items: NewsItem[] = Array.isArray(payload.data) ? payload.data : []
      setNews(items)

      // Extract trending tickers from news
      const tickers = items
        .map(item => item.relatedSymbol)
        .filter((s): s is string => !!s)
      setTrendingTickers(Array.from(new Set(tickers)).slice(0, 8))
    } catch {
      setError("Live news is unavailable right now. Please try refreshing.")
      setNews([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadNews(category)
  }, [loadNews, category])

  const featuredNews = news.length > 0 ? news[0] : null
  const remainingNews = news.slice(1)

  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader
        icon={Newspaper}
        title="Finance & Business News"
        description="AI-curated live news with actionable insights for your portfolio."
      >
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="hidden sm:flex items-center gap-1.5 bg-accent/10 text-accent border-accent/20 py-1.5 px-3">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            Live Feed
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground gap-2 border border-border/50"
            onClick={() => loadNews(category)}
            disabled={loading}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </PageHeader>

      {/* Category Tabs */}
      <Tabs value={category} onValueChange={(value) => setCategory(value as Category)}>
        <TabsList className="w-full justify-start overflow-x-auto sm:w-auto">
          {categories.map((cat) => {
            const Icon = cat.icon
            return (
              <TabsTrigger key={cat.value} value={cat.value} className="gap-2">
                <Icon className="h-3.5 w-3.5" />
                {cat.label}
              </TabsTrigger>
            )
          })}
        </TabsList>
      </Tabs>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        {/* Main Content */}
        <div className="space-y-4">
          {/* Loading State */}
          {loading && (
            <>
              <Skeleton className="h-48 w-full bg-muted/60 rounded-xl" />
              <div className="grid gap-3 sm:grid-cols-2">
                <Skeleton className="h-40 w-full bg-muted/60 rounded-xl" />
                <Skeleton className="h-40 w-full bg-muted/60 rounded-xl" />
              </div>
            </>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="rounded-xl border border-destructive/20 bg-destructive/[0.06] p-4 text-sm text-destructive flex items-start gap-2">
              <CircleAlert className="h-4 w-4 mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && news.length === 0 && (
            <div className="rounded-xl border border-border bg-card p-8 text-center">
              <Newspaper className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-30" />
              <p className="font-medium">No live news returned for this category.</p>
              <p className="text-sm text-muted-foreground mt-1">Refresh or switch to another category.</p>
            </div>
          )}

          {/* Featured Story */}
          {!loading && !error && featuredNews && (
            <Card className="group overflow-hidden border-primary/20 bg-gradient-to-br from-primary/[0.04] to-transparent hover:border-primary/30 transition-all duration-300 animate-slide-up news-card">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-primary/15 text-primary border-primary/20 hover:bg-primary/20">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                  <Badge variant="outline">{featuredNews.category}</Badge>
                  {featuredNews.relatedSymbol && (
                    <Badge variant="success">{featuredNews.relatedSymbol}</Badge>
                  )}
                  <span className="text-xs text-muted-foreground ml-auto">
                    {formatTime(featuredNews.publishedAt)}
                  </span>
                </div>
                <CardTitle className="text-xl leading-relaxed group-hover:text-primary transition-colors">
                  {featuredNews.title}
                </CardTitle>
                <CardDescription className="text-sm">{featuredNews.publisher}</CardDescription>
              </CardHeader>
              <CardContent>
                {featuredNews.summary && (
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {featuredNews.summary}
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  <Button asChild size="sm" className="gap-2">
                    <Link href={`/zust-ai?q=${encodeURIComponent(featuredNews.relatedSymbol || featuredNews.title)}`}>
                      <Bot className="h-3.5 w-3.5" />
                      Analyze with ZUST AI
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                    <a href={featuredNews.link} target="_blank" rel="noreferrer">
                      <ExternalLink className="h-3.5 w-3.5" />
                      Read Source
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* News Grid */}
          {!loading && !error && remainingNews.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {remainingNews.map((item, index) => (
                <Card
                  key={item.id}
                  className="group hover:bg-muted/30 dark:hover:bg-white/[0.03] hover:border-border transition-all duration-300 animate-slide-up news-card"
                  style={{ animationDelay: `${(index + 1) * 50}ms` }}
                >
                  <CardHeader className="pb-2">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      <Badge variant="outline" className="text-[10px] py-0.5">{item.category}</Badge>
                      {item.relatedSymbol && (
                        <Badge variant="success" className="text-[10px] py-0.5">{item.relatedSymbol}</Badge>
                      )}
                      <span className="text-[10px] text-muted-foreground ml-auto">
                        {formatTime(item.publishedAt)}
                      </span>
                    </div>
                    <CardTitle className="text-sm leading-relaxed group-hover:text-primary transition-colors line-clamp-2">
                      {item.title}
                    </CardTitle>
                    <CardDescription className="text-xs">{item.publisher}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {item.summary && (
                      <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">
                        {item.summary}
                      </p>
                    )}
                    <div className="flex gap-1.5">
                      <Button asChild variant="ghost" size="sm" className="h-7 px-2 gap-1.5 text-xs text-muted-foreground">
                        <a href={item.link} target="_blank" rel="noreferrer">
                          <ExternalLink className="h-3 w-3" />
                          Source
                        </a>
                      </Button>
                      <Button asChild size="sm" className="h-7 px-2 gap-1.5 text-xs">
                        <Link href={`/zust-ai?q=${encodeURIComponent(item.relatedSymbol || item.title)}`}>
                          <Bot className="h-3 w-3" />
                          Ask AI
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Trending Tickers */}
          {trendingTickers.length > 0 && (
            <Card className="animate-slide-up">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-accent" />
                  Trending Tickers
                </CardTitle>
                <CardDescription>Stocks mentioned in today&apos;s headlines</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {trendingTickers.map((ticker) => (
                    <Link key={ticker} href={`/zust-ai?q=${encodeURIComponent(ticker)}`}>
                      <Badge
                        variant="outline"
                        className="cursor-pointer hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all py-1.5 px-3"
                      >
                        {ticker}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Quick Insights */}
          <Card className="border-accent/20 bg-gradient-to-b from-accent/[0.04] to-transparent animate-slide-up" style={{ animationDelay: "100ms" }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-accent">
                <Sparkles className="h-4 w-4" />
                Smart Actions
              </CardTitle>
              <CardDescription>AI-powered tips before reacting to news.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickInsights.map((insight) => {
                const Icon = insight.icon
                return (
                  <Link key={insight.title} href={`/zust-ai?q=${encodeURIComponent(insight.prompt)}`}>
                    <div className="rounded-xl border border-accent/10 bg-card p-3 hover:border-accent/30 hover:shadow-sm transition-all group mb-3 last:mb-0">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                          <Icon className="h-4 w-4 text-accent shrink-0" />
                        </div>
                        <div>
                          <p className="text-sm font-medium group-hover:text-accent transition-colors">{insight.title}</p>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{insight.body}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </CardContent>
          </Card>

          {/* Live Intelligence Badge */}
          <Card className="border-primary/20 bg-primary/[0.03] animate-slide-up" style={{ animationDelay: "200ms" }}>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent" />
                </span>
                Live Intelligence
              </CardTitle>
              <CardDescription>
                All news is fetched live from Yahoo Finance. Click &quot;Analyze with ZUST AI&quot; on any article to get AI-powered context for your portfolio.
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

  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date)
}
