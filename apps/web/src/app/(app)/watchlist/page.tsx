"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, TrendingUp, TrendingDown, Activity } from "lucide-react"

export default function WatchlistPage() {
  const watchlist = [
    { ticker: "TSLA", name: "Tesla Inc.", price: 245.60, change: "+2.4%", aiScore: 82, trend: "up" },
    { ticker: "NVDA", name: "NVIDIA Corp.", price: 460.10, change: "+1.2%", aiScore: 94, trend: "up" },
    { ticker: "META", name: "Meta Platforms", price: 310.20, change: "-0.5%", aiScore: 65, trend: "down" },
    { ticker: "PLTR", name: "Palantir Tech.", price: 18.40, change: "+5.1%", aiScore: 88, trend: "up" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <LineChart className="h-8 w-8 text-primary" />
            Watchlist Intelligence
          </h2>
          <p className="text-muted-foreground mt-1">AI-powered tracking of your target assets.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-1">
        <Card className="bg-black/40 border-white/5">
          <CardHeader>
            <CardTitle>Monitored Assets</CardTitle>
            <CardDescription>ZUST AI is actively monitoring these assets for entry signals.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-white/10 overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-white/5 text-xs uppercase text-gray-400 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 font-medium">Asset</th>
                    <th className="px-6 py-4 font-medium text-right">Price</th>
                    <th className="px-6 py-4 font-medium text-right">24h Change</th>
                    <th className="px-6 py-4 font-medium text-center">ZUST AI Score</th>
                    <th className="px-6 py-4 font-medium text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {watchlist.map((asset) => (
                    <tr key={asset.ticker} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="font-bold text-white bg-white/10 px-2 py-1 rounded text-xs">{asset.ticker}</div>
                          <span className="font-medium text-gray-300">{asset.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-white">
                        ₹{asset.price.toFixed(2)}
                      </td>
                      <td className={`px-6 py-4 text-right font-bold ${asset.trend === 'up' ? 'text-accent' : 'text-destructive'}`}>
                        <div className="flex items-center justify-end gap-1">
                          {asset.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          {asset.change}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                          <Activity className="h-3 w-3 text-primary" />
                          <span className="font-bold text-primary">{asset.aiScore}/100</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
                          View Analysis
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
