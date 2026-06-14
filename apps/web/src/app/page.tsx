"use client"

import { TrendingUp, Shield, Brain, BarChart3, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ZestifyLogo } from "@/components/shared/ZestifyLogo"

const features = [
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description: "ZUST AI provides probability-weighted analysis with explainable reasoning, not generic advice.",
  },
  {
    icon: Shield,
    title: "Compliance-First",
    description: "Statistical intelligence, not financial advice. Risk scores and confidence intervals on every insight.",
  },
  {
    icon: TrendingUp,
    title: "Zest-Score",
    description: "Your personal financial health metric tracking diversification, savings rate, and debt management.",
  },
  {
    icon: BarChart3,
    title: "Portfolio Intelligence",
    description: "Deep allocation analysis, hidden fee detection, and rebalancing recommendations.",
  },
]

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground overflow-hidden">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-6 py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(34,197,94,0.08),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(34,197,94,0.12),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_50%,rgba(10,132,255,0.04),transparent)] dark:bg-[radial-gradient(ellipse_60%_40%_at_80%_50%,rgba(10,132,255,0.06),transparent)]" />

        <nav className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-5 sm:px-10">
          <ZestifyLogo size="sm" />
          <div className="flex items-center gap-3">
            <a href="/login">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                Log In
              </Button>
            </a>
            <a href="/signup">
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-white rounded-full">
                Get Started
              </Button>
            </a>
          </div>
        </nav>

        <div className="relative z-10 w-full max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
            <TrendingUp className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium text-primary">The Future of Personal Finance</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.1] mb-6 animate-slide-up">
            <span className="text-gradient-brand">Intelligence</span>
            {" "}over
            {" "}<span className="text-foreground">Execution</span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: "100ms" }}>
            Stop relying on outdated advice. Start leveraging ZUST AI to optimize your net worth in real-time with institutional-grade risk intelligence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: "200ms" }}>
            <a href="/signup">
              <Button className="h-12 px-8 bg-primary hover:bg-primary/90 text-white rounded-full text-base font-semibold shadow-glow-primary hover:shadow-[0_0_30px_rgba(10,132,255,0.3)] transition-all duration-300">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
            <a href="/login">
              <Button variant="outline" className="h-12 px-8 rounded-full text-base font-semibold border-border hover:bg-muted/50 dark:hover:bg-white/[0.04]">
                Log In
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative px-6 py-24 sm:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_0%,rgba(10,132,255,0.03),transparent)] dark:bg-[radial-gradient(ellipse_50%_50%_at_50%_0%,rgba(10,132,255,0.05),transparent)]" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
              Built for the modern investor
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Not a budgeting app. Not a trading platform. A financial intelligence layer.
            </p>
          </div>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            {features.map((feature, i) => (
              <Card
                key={feature.title}
                className="bg-card/50 dark:bg-white/[0.02] border-border hover:bg-muted/30 dark:hover:bg-white/[0.04] hover:border-muted-foreground/20 dark:hover:border-white/[0.1] transition-all duration-300 group animate-slide-up hover:shadow-card-hover"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 mb-4 group-hover:bg-primary/15 transition-colors">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-base font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-6 py-24 sm:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_80%,rgba(34,197,94,0.04),transparent)] dark:bg-[radial-gradient(ellipse_60%_40%_at_50%_80%,rgba(48,209,88,0.06),transparent)]" />
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
            Ready to optimize your wealth?
          </h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of investors using ZUST AI to make smarter financial decisions.
          </p>
          <a href="/signup">
            <Button className="h-12 px-10 bg-accent hover:bg-accent/90 text-black rounded-full text-base font-semibold shadow-glow-accent hover:shadow-[0_0_30px_rgba(48,209,88,0.3)] transition-all duration-300">
              Start for Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </a>
        </div>
      </section>

      <footer className="border-t border-border px-6 py-8 sm:px-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <ZestifyLogo size="xs" />
          <p className="text-xs text-muted-foreground">
            Statistical intelligence, not financial advice.
          </p>
        </div>
      </footer>
    </main>
  )
}
