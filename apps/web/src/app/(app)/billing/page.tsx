"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, Check, Shield, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageHeader } from "@/components/shared/PageHeader"
import { toast } from "sonner"

const plans = [
  {
    name: "Free",
    slug: "free",
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "Essential tracking to get started",
    features: [
      "1 Portfolio",
      "Up to 25 Holdings",
      "Basic Analytics",
      "Manual Transaction Entry",
      "3 Goals",
    ],
    current: true,
  },
  {
    name: "Pro",
    slug: "pro",
    monthlyPrice: 299,
    yearlyPrice: 2499,
    description: "Advanced tools for serious investors",
    features: [
      "5 Portfolios",
      "Unlimited Holdings",
      "ZUST AI Copilot (500 queries/mo)",
      "Unlimited Goals & Watchlist",
      "Price Alerts",
      "CSV/PDF Exports",
    ],
    popular: true,
    current: false,
  },
  {
    name: "Elite",
    slug: "elite",
    monthlyPrice: 799,
    yearlyPrice: 6999,
    description: "Complete financial operating system",
    features: [
      "Unlimited Portfolios",
      "Unlimited ZUST AI",
      "Advanced Tax Reports",
      "Portfolio Rebalancing Alerts",
      "API Access",
      "Family Sharing",
      "Custom Reports",
    ],
    current: false,
  },
]

const billingHistory = [
  { id: "1", date: "Jun 1, 2026", amount: "₹0", status: "Free Tier", plan: "Free" },
  { id: "2", date: "May 1, 2026", amount: "₹0", status: "Free Tier", plan: "Free" },
]

export default function BillingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")

  const handleUpgrade = (planName: string) => {
    toast.success(`Upgrade to ${planName} initiated. Redirecting to Razorpay...`)
  }

  return (
    <div className="space-y-6 max-w-[1200px]">
      <PageHeader icon={CreditCard} title="Billing & Subscription" description="Manage your ZESTIFY plan." />

      {/* Billing Toggle */}
      <div className="flex items-center justify-center">
        <Tabs value={billingCycle} onValueChange={(v) => setBillingCycle(v as "monthly" | "yearly")}>
          <TabsList>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">
              Yearly
              <Badge variant="success" className="ml-2 text-[9px] px-1.5 py-0">Save 30%</Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Plan Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan, i) => {
          const price = billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice
          const cycleLabel = billingCycle === "monthly" ? "/mo" : "/yr"

          return (
            <Card
              key={plan.slug}
              className={`relative overflow-hidden transition-all duration-300 animate-slide-up ${
                plan.popular
                  ? "border-primary/30 bg-primary/[0.03] shadow-glow-primary"
                  : plan.current
                  ? "border-accent/20"
                  : ""
              }`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                  Recommended
                </div>
              )}
              {plan.current && (
                <div className="absolute top-0 right-0 bg-accent text-black text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                  Current
                </div>
              )}
              <CardHeader>
                <CardTitle className={plan.popular ? "text-primary" : ""}>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4 flex items-baseline text-3xl sm:text-4xl font-bold">
                  ₹{price.toLocaleString("en-IN")}
                  <span className="ml-1 text-base font-medium text-muted-foreground">{cycleLabel}</span>
                </div>
                {billingCycle === "yearly" && price > 0 && (
                  <p className="text-xs text-accent">
                    Save ₹{((plan.monthlyPrice * 12) - plan.yearlyPrice).toLocaleString("en-IN")}/year
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className={`h-4 w-4 shrink-0 ${plan.popular ? "text-primary" : "text-accent"}`} />
                    {f}
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                {plan.current ? (
                  <Button variant="outline" className="w-full" disabled>Current Plan</Button>
                ) : (
                  <Button
                    onClick={() => handleUpgrade(plan.name)}
                    className={`w-full font-semibold ${plan.popular ? "bg-primary hover:bg-primary/90 text-white" : ""}`}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Upgrade to {plan.name}
                  </Button>
                )}
              </CardFooter>
            </Card>
          )
        })}
      </div>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Billing History</CardTitle>
          <CardDescription>Past invoices and payment records.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-white/[0.06] overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-white/[0.02] text-xs uppercase text-muted-foreground border-b border-white/[0.06]">
                <tr>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Plan</th>
                  <th className="px-4 py-3 font-medium text-right">Amount</th>
                  <th className="px-4 py-3 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {billingHistory.map((h) => (
                  <tr key={h.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3">{h.date}</td>
                    <td className="px-4 py-3">{h.plan}</td>
                    <td className="px-4 py-3 text-right font-medium">{h.amount}</td>
                    <td className="px-4 py-3 text-right">
                      <Badge variant="outline" className="text-[10px]">{h.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
