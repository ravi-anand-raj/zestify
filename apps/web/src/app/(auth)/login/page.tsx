"use client"

import * as React from "react"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ArrowRight, Eye, EyeOff, TrendingUp, Shield, Brain, BarChart3 } from "lucide-react"
import { ZestifyLogo } from "@/components/shared/ZestifyLogo"
import { useLanguage } from "@/components/providers/LanguageProvider"

const features = [
  { icon: Brain, label: "AI-Powered Insights" },
  { icon: Shield, label: "Bank-Grade Security" },
  { icon: TrendingUp, label: "Real-Time Analytics" },
  { icon: BarChart3, label: "Portfolio Intelligence" },
]

export default function LoginPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (res?.error) {
      setError(t.auth.invalidCredentials)
      setPassword("")
      setLoading(false)
    } else {
      router.push("/dashboard")
      router.refresh()
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Panel — Branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[50%] relative overflow-hidden bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 dark:from-emerald-900 dark:via-green-900 dark:to-teal-900">
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Floating glow */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-emerald-300/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />

        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <div>
            <ZestifyLogo size="lg" textClassName="!text-white [&>span]:!bg-none [&>span]:!text-white" />
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-4xl xl:text-5xl font-bold tracking-tight leading-tight">
                Your Financial<br />
                <span className="text-emerald-200">Intelligence</span> Hub
              </h2>
              <p className="text-white/70 mt-4 text-lg max-w-md leading-relaxed">
                Join thousands of investors making smarter decisions with AI-powered financial intelligence.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {features.map((f, i) => (
                <div
                  key={f.label}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 animate-slide-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
                    <f.icon className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-white/90">{f.label}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-white/40 text-xs">
            © 2026 Zestify. Statistical intelligence, not financial advice.
          </p>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-[420px] space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center">
            <ZestifyLogo size="lg" />
          </div>

          {/* Header */}
          <div className="space-y-2 text-center lg:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t.auth.welcomeBack}</h1>
            <p className="text-muted-foreground text-sm">{t.auth.signInDescription}</p>
          </div>

          {/* Google Sign In */}
          <Button
            variant="outline"
            className="w-full h-11 gap-3 rounded-xl text-sm font-medium border-border hover:bg-muted/50 dark:hover:bg-white/[0.04]"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            {t.auth.signInWithGoogle}
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background px-3 text-muted-foreground">{t.auth.orContinueWith}</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-destructive/[0.08] border border-destructive/20 text-sm text-destructive text-center animate-slide-down">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">{t.auth.email}</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 rounded-xl bg-muted/30 dark:bg-white/[0.04] border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">{t.auth.password}</Label>
                <a href="/forgot-password" className="text-xs text-primary hover:underline">
                  {t.auth.forgotPassword}
                </a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 rounded-xl bg-muted/30 dark:bg-white/[0.04] border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold shadow-glow-primary hover:shadow-[0_0_30px_rgba(10,132,255,0.25)] transition-all duration-300"
              type="submit"
              disabled={loading}
            >
              {loading ? t.auth.authenticating : t.common.logIn}
              {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>

          {/* Sign Up Link */}
          <p className="text-sm text-center text-muted-foreground">
            {t.auth.noAccount}{" "}
            <a href="/signup" className="text-primary hover:underline font-semibold">
              {t.common.signUp}
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
