import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, PieChart, Activity } from "lucide-react"
import prisma from "@zestify/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function PortfolioPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/login')
  }

  const userAccounts = await prisma.account.findMany({
    where: { userId: (session.user as any).id },
    include: { 
      holdings: {
        include: { security: true }
      }
    }
  })

  let totalAssets = 0
  let mappedHoldings: any[] = []

  userAccounts.forEach(acc => {
    totalAssets += Number(acc.currentBalance)
    if (Number(acc.currentBalance) > 0) {
       mappedHoldings.push({
         ticker: "CASH",
         name: acc.name,
         value: Number(acc.currentBalance),
         trend: "+0.0%"
       })
    }

    acc.holdings.forEach(h => {
      const val = Number(h.currentValue)
      totalAssets += val
      mappedHoldings.push({
        ticker: h.security.tickerSymbol,
        name: h.security.name,
        value: val,
        trend: val > Number(h.costBasis) ? "+1.2%" : "-0.5%" // Mock trend calc
      })
    })
  })

  mappedHoldings = mappedHoldings.map(h => ({
    ...h,
    allocation: ((h.value / totalAssets) * 100).toFixed(1)
  })).sort((a, b) => b.value - a.value)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Wallet className="h-8 w-8 text-primary" />
            Portfolio Intelligence
          </h2>
          <p className="text-muted-foreground mt-1">Deep analysis of your linked assets and asset allocation.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="bg-black/40 border-white/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">Total Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹{totalAssets.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
          </CardContent>
        </Card>
        <Card className="bg-black/40 border-white/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">1Y Return</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">+14.2%</div>
          </CardContent>
        </Card>
        <Card className="bg-black/40 border-white/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">Risk Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">Moderate</div>
          </CardContent>
        </Card>
        <Card className="bg-black/40 border-white/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">Estimated Yield</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">₹3,420 / yr</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              Holdings Breakdown
            </CardTitle>
            <CardDescription>Your assets across all linked institutions.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mappedHoldings.map((h, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-gray-800 to-gray-700 flex items-center justify-center font-bold text-xs border border-white/10">
                      {h.ticker}
                    </div>
                    <div>
                      <p className="font-semibold">{h.name}</p>
                      <p className="text-xs text-muted-foreground">{h.allocation}% Allocation</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{h.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                    <p className={`text-xs ${h.trend.startsWith('+') ? 'text-accent' : 'text-destructive'}`}>
                      {h.trend}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-accent" />
              Diversification Analysis
            </CardTitle>
            <CardDescription>ZUST AI Assessment</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Equities</span>
                <span className="font-medium">80%</span>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[80%] rounded-full"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Cash & Equivalents</span>
                <span className="font-medium">20%</span>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-accent w-[20%] rounded-full"></div>
              </div>
            </div>

            <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl mt-6">
              <p className="text-sm font-semibold text-primary mb-1">ZUST AI Insight</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your portfolio is heavily concentrated in US Equities. While this maximizes growth potential, it increases volatility. Consider increasing fixed-income exposure if your time horizon is less than 5 years.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
