"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, Check, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <CreditCard className="h-8 w-8 text-primary" />
            Billing & Subscription
          </h2>
          <p className="text-muted-foreground mt-1">Manage your ZESTIFY Premium plan.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 max-w-4xl">
        {/* Free Plan */}
        <Card className="bg-black/40 border-white/5 opacity-70">
          <CardHeader>
            <CardTitle>Zestify Basic</CardTitle>
            <CardDescription>Essential tracking</CardDescription>
            <div className="mt-4 flex items-baseline text-4xl font-bold">
              ₹0
              <span className="ml-1 text-xl font-medium text-muted-foreground">/mo</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-accent" /> Manual Portfolio Entry</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-accent" /> Basic Health Score</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-accent" /> 1 Watchlist Asset</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" disabled>Current Plan</Button>
          </CardFooter>
        </Card>

        {/* Premium Plan */}
        <Card className="bg-primary/5 border-primary/20 relative overflow-hidden shadow-[0_0_30px_rgba(10,132,255,0.1)]">
          <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
            Recommended
          </div>
          <CardHeader>
            <CardTitle className="text-primary">Zestify Premium</CardTitle>
            <CardDescription>Full AI Intelligence Suite</CardDescription>
            <div className="mt-4 flex items-baseline text-4xl font-bold text-white">
              ₹2900
              <span className="ml-1 text-xl font-medium text-muted-foreground">/mo</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Plaid Auto-Sync (Unlimited)</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> ZUST AI Financial Copilot (GPT-4o/Gemini)</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Unlimited Watchlist tracking</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Advanced What-If Simulator</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Dynamic Wealth Roadmap</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold">
              <Shield className="h-4 w-4 mr-2" /> Upgrade via Razorpay
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
