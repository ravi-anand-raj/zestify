"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartLine as LineChart, TrendingUp, TrendingDown, Activity, Plus, X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { PageHeader } from "@/components/shared/PageHeader"
import { EmptyState } from "@/components/shared/EmptyState"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { toast } from "sonner"

type WatchlistItem = {
  id: string
  ticker: string
  name: string
  price: number
  change: string
  aiScore: number
  trend: "up" | "down"
}

const initialWatchlist: WatchlistItem[] = [
  { id: "1", ticker: "RELIANCE", name: "Reliance Industries", price: 2935.45, change: "+1.8%", aiScore: 82, trend: "up" },
  { id: "2", ticker: "TCS", name: "Tata Consultancy Services", price: 4122.30, change: "+0.9%", aiScore: 94, trend: "up" },
  { id: "3", ticker: "HDFCBANK", name: "HDFC Bank Limited", price: 1812.75, change: "-0.5%", aiScore: 65, trend: "down" },
  { id: "4", ticker: "INFY", name: "Infosys Limited", price: 1654.20, change: "+3.1%", aiScore: 88, trend: "up" },
  { id: "5", ticker: "ITC", name: "ITC Limited", price: 468.55, change: "+0.4%", aiScore: 72, trend: "up" },
]

const searchableAssets = [
  { ticker: "AAPL", name: "Apple Inc." },
  { ticker: "GOOGL", name: "Alphabet Inc." },
  { ticker: "MSFT", name: "Microsoft Corp." },
  { ticker: "AMZN", name: "Amazon.com Inc." },
  { ticker: "NVDA", name: "NVIDIA Corp." },
  { ticker: "TSLA", name: "Tesla Inc." },
]

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? "text-accent" : score >= 60 ? "text-primary" : "text-warning"
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20">
      <Activity className={`h-3 w-3 ${color}`} />
      <span className={`font-bold text-xs ${color}`}>{score}/100</span>
    </div>
  )
}

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(initialWatchlist)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredAssets = searchableAssets.filter(
    (a) =>
      a.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAdd = (ticker: string, name: string) => {
    if (watchlist.find((w) => w.ticker === ticker)) return
    const newItem: WatchlistItem = {
      id: Date.now().toString(),
      ticker,
      name,
      price: Math.round(Math.random() * 5000 * 100) / 100,
      change: `${(Math.random() * 6 - 2).toFixed(1)}%`,
      aiScore: Math.round(Math.random() * 40 + 60),
      trend: Math.random() > 0.3 ? "up" : "down",
    }
    setWatchlist((prev) => [...prev, newItem])
    toast.success(`${ticker} added to watchlist`)
    setAddDialogOpen(false)
  }

  const handleRemove = (id: string) => {
    const item = watchlist.find((w) => w.id === id)
    setWatchlist((prev) => prev.filter((w) => w.id !== id))
    toast.success(`${item?.ticker} removed from watchlist`)
  }

  if (watchlist.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader icon={LineChart} title="Watchlist Intelligence" description="AI-powered tracking of your target assets.">
          <Button onClick={() => setAddDialogOpen(true)} className="bg-primary hover:bg-primary/90 text-white rounded-full px-5">
            <Plus className="h-4 w-4 mr-2" />
            Add Asset
          </Button>
        </PageHeader>
        <EmptyState
          icon={LineChart}
          title="No assets tracked"
          description="Add stocks, ETFs, or mutual funds to your watchlist to start receiving AI-powered signals."
          action={{ label: "Add Asset", onClick: () => setAddDialogOpen(true) }}
        />
        <AddDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} searchQuery={searchQuery} setSearchQuery={setSearchQuery} filteredAssets={filteredAssets} onAdd={handleAdd} />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader icon={LineChart} title="Watchlist Intelligence" description="AI-powered tracking of your target assets.">
        <Button onClick={() => { setSearchQuery(""); setAddDialogOpen(true) }} className="bg-primary hover:bg-primary/90 text-white rounded-full px-5">
          <Plus className="h-4 w-4 mr-2" />
          Add Asset
        </Button>
      </PageHeader>

      {/* Desktop Table */}
      <Card className="hidden md:block">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Monitored Assets</CardTitle>
              <CardDescription>ZUST AI is actively monitoring for entry signals.</CardDescription>
            </div>
            <Badge variant="outline">{watchlist.length} assets</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-white/[0.06] overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-white/[0.02] text-xs uppercase text-muted-foreground border-b border-white/[0.06]">
                <tr>
                  <th className="px-4 py-3 font-medium">Asset</th>
                  <th className="px-4 py-3 font-medium text-right">Price</th>
                  <th className="px-4 py-3 font-medium text-right">24h Change</th>
                  <th className="px-4 py-3 font-medium text-center">AI Score</th>
                  <th className="px-4 py-3 font-medium text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {watchlist.map((asset, i) => (
                  <tr key={asset.id} className="hover:bg-white/[0.02] transition-colors animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="font-bold text-[10px] bg-white/[0.06] px-2 py-1 rounded border border-white/[0.06]">
                          {asset.ticker}
                        </div>
                        <span className="font-medium text-sm truncate max-w-[200px]">{asset.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      ₹{asset.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                    <td className={`px-4 py-3 text-right font-semibold text-xs ${asset.trend === "up" ? "text-accent" : "text-destructive"}`}>
                      <div className="flex items-center justify-end gap-1">
                        {asset.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {asset.change}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <ScoreBadge score={asset.aiScore} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <a href={`/zust-ai`}>
                          <Button variant="ghost" size="sm" className="text-xs text-primary hover:text-primary/80 h-7 px-2">
                            Analyze
                          </Button>
                        </a>
                        <Button variant="ghost" size="sm" className="text-xs text-destructive hover:text-destructive/80 h-7 px-2" onClick={() => handleRemove(asset.id)}>
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {watchlist.map((asset, i) => (
          <Card key={asset.id} className="animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="font-bold text-[10px] bg-white/[0.06] px-2 py-1 rounded border border-white/[0.06]">
                    {asset.ticker}
                  </div>
                  <span className="font-medium text-sm">{asset.name}</span>
                </div>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground" onClick={() => handleRemove(asset.id)}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">₹{asset.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
                  <p className={`text-xs font-semibold flex items-center gap-0.5 ${asset.trend === "up" ? "text-accent" : "text-destructive"}`}>
                    {asset.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {asset.change}
                  </p>
                </div>
                <ScoreBadge score={asset.aiScore} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AddDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} searchQuery={searchQuery} setSearchQuery={setSearchQuery} filteredAssets={filteredAssets} onAdd={handleAdd} />
    </div>
  )
}

function AddDialog({ open, onOpenChange, searchQuery, setSearchQuery, filteredAssets, onAdd }: {
  open: boolean
  onOpenChange: (v: boolean) => void
  searchQuery: string
  setSearchQuery: (v: string) => void
  filteredAssets: { ticker: string; name: string }[]
  onAdd: (ticker: string, name: string) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to Watchlist</DialogTitle>
          <DialogDescription>Search for a stock, ETF, or mutual fund to track.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ticker or name..."
              className="pl-9"
            />
          </div>
          <div className="space-y-1 max-h-[200px] overflow-y-auto">
            {filteredAssets.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No assets found</p>
            )}
            {filteredAssets.map((a) => (
              <button
                key={a.ticker}
                onClick={() => onAdd(a.ticker, a.name)}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.04] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="font-bold text-xs bg-white/[0.06] px-2 py-1 rounded border border-white/[0.06]">
                    {a.ticker}
                  </div>
                  <span className="text-sm">{a.name}</span>
                </div>
                <Plus className="h-4 w-4 text-primary" />
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
