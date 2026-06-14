"use client"

import * as React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ArrowRight, Eye, EyeOff, Check, Sparkles, Target, LineChart, Zap } from "lucide-react"
import { ZestifyLogo } from "@/components/shared/ZestifyLogo"
import { useLanguage } from "@/components/providers/LanguageProvider"

const benefits = [
  { icon: Sparkles, text: "AI-powered financial copilot" },
  { icon: Target, text: "Smart goal tracking & planning" },
  { icon: LineChart, text: "Real-time portfolio analysis" },
  { icon: Zap, text: "Instant Zest-Score insights" },
]

export default function SignupPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const passwordStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 8 ? 2 : 3
  const strengthLabels = [
    "",
    t.auth.passwordStrength.weak,
    t.auth.passwordStrength.fair,
    t.auth.passwordStrength.strong,
  ]
  const strengthColors = ["", "bg-destructive", "bg-warning", "bg-accent"]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.")
      setLoading(false)
      return
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, firstName, lastName })
      })

      const data = await res.json()

      if (data.success) {
        router.push("/login")
      } else {
        setError(data.error || "Failed to create account")
      }
    } catch (err) {
      setError("An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Panel — Branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[50%] relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 dark:from-blue-900 dark:via-indigo-900 dark:to-violet-900">
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Floating glow */}
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-violet-300/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />

        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <div>
            <ZestifyLogo size="lg" textClassName="!text-white [&>span]:!bg-none [&>span]:!text-white" />
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-4xl xl:text-5xl font-bold tracking-tight leading-tight">
                Start Your<br />
                <span className="text-blue-200">Wealth Journey</span>
              </h2>
              <p className="text-white/70 mt-4 text-lg max-w-md leading-relaxed">
                Create your free account and get access to institutional-grade financial intelligence.
              </p>
            </div>

            <div className="space-y-3">
              {benefits.map((b, i) => (
                <div
                  key={b.text}
                  className="flex items-center gap-3 animate-slide-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm">
                    <b.icon className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-white/90">{b.text}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-white/40 text-xs">
            © 2026 Zestify. Free forever plan available.
          </p>
        </div>
      </div>

      {/* Right Panel — Signup Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-[420px] space-y-6">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center">
            <ZestifyLogo size="lg" />
          </div>

          {/* Header */}
          <div className="space-y-2 text-center lg:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t.auth.createAccount}</h1>
            <p className="text-muted-foreground text-sm">{t.auth.signUpDescription}</p>
          </div>

          {/* Google Sign Up */}
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
            Sign up with Google
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

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium">{t.auth.firstName}</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="h-11 rounded-xl bg-muted/30 dark:bg-white/[0.04] border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium">{t.auth.lastName}</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="h-11 rounded-xl bg-muted/30 dark:bg-white/[0.04] border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

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
              <Label htmlFor="password" className="text-sm font-medium">{t.auth.password}</Label>
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
              {/* Password Strength */}
              {password.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex gap-1">
                    {[1, 2, 3].map((level) => (
                      <div
                        key={level}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          passwordStrength >= level ? strengthColors[level] : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-[11px] font-medium ${
                    passwordStrength === 1 ? "text-destructive" :
                    passwordStrength === 2 ? "text-warning" :
                    "text-accent"
                  }`}>
                    {strengthLabels[passwordStrength]}
                  </p>
                </div>
              )}
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2.5 cursor-pointer group">
              <div
                className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all ${
                  agreed
                    ? "bg-primary border-primary"
                    : "border-border group-hover:border-muted-foreground"
                }`}
                onClick={() => setAgreed(!agreed)}
              >
                {agreed && <Check className="h-3 w-3 text-white" />}
              </div>
              <span className="text-xs text-muted-foreground leading-relaxed">
                {t.auth.agreeTerms}
              </span>
            </label>

            <Button
              className="w-full h-11 rounded-xl bg-accent hover:bg-accent/90 text-black font-semibold shadow-glow-accent hover:shadow-[0_0_30px_rgba(48,209,88,0.25)] transition-all duration-300"
              type="submit"
              disabled={loading || !agreed}
            >
              {loading ? t.auth.creating : t.common.signUp}
              {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>

          {/* Login Link */}
          <p className="text-sm text-center text-muted-foreground">
            {t.auth.hasAccount}{" "}
            <a href="/login" className="text-primary hover:underline font-semibold">
              {t.common.logIn}
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
