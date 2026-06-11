import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, TrendingUp, Wallet, ShieldAlert, Zap, Bot } from "lucide-react"
import prisma from "@zestify/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/login')
  }

  // Fetch live data from Prisma
  const userAccounts = await prisma.account.findMany({
    where: { userId: (session.user as any).id },
    include: { holdings: true }
  })

  let totalAssets = 0
  userAccounts.forEach(acc => {
    totalAssets += Number(acc.currentBalance)
    acc.holdings.forEach(h => {
      totalAssets += Number(h.currentValue)
    })
  })

  const zestScoreRecord = await prisma.zestScore.findFirst({
    where: { userId: (session.user as any).id },
    orderBy: { calculatedAt: 'desc' }
  })
  
  const zestScore = zestScoreRecord?.score || 782

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
          <p className="text-muted-foreground mt-1">Here is your financial intelligence for today.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Net Worth */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Net Worth</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹{totalAssets.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
            <p className="text-xs text-accent mt-1 flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +2.5% from last month
            </p>
          </CardContent>
        </Card>

        {/* ZEST Score */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <TrendingUp className="h-24 w-24 text-primary" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-primary">Zest-Score</CardTitle>
            <Zap className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-bold text-white">{zestScore}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Top 14% of your age bracket
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        {/* Main Chart Area */}
        <Card className="md:col-span-4 lg:col-span-5">
          <CardHeader>
            <CardTitle>Wealth Trajectory</CardTitle>
            <CardDescription>Your net worth over the last 12 months</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center border border-dashed border-white/10 rounded-xl m-6 mt-0">
            <p className="text-muted-foreground text-sm">Spline Chart Component Loaded</p>
          </CardContent>
        </Card>

        {/* ZUST AI Feed */}
        <Card className="md:col-span-3 lg:col-span-2 flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center text-warning">
              <Bot className="h-5 w-5 mr-2" />
              ZUST AI Feed
            </CardTitle>
            <CardDescription>Real-time actionable insights</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            
            <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
              <div className="flex items-start gap-2">
                <ShieldAlert className="h-4 w-4 text-warning mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-white">Hidden Fee Detected</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your Vanguard Mutual Fund charges 1.2%. ETF VOO is identical at 0.03%.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-start gap-2">
                <TrendingUp className="h-4 w-4 text-accent mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-white">AAPL Earnings Update</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Apple beat Q3 estimates by 12%. Probability of positive short-term momentum: 72%.
                  </p>
                </div>
              </div>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  )
}
