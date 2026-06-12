"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, Send, ShieldAlert, Sparkles, TrendingUp, Copy, RefreshCw, CircleAlert as AlertCircle, ChartBar as BarChart3, Wallet, Target } from "lucide-react"
import { toast } from "sonner"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  parsed?: {
    insight: string
    explainable_reasoning: string
    probability: string
    confidence: string
    risk_score: string
    disclaimer: string
  }
}

const suggestedPrompts = [
  { icon: BarChart3, label: "Analyze my portfolio", prompt: "Analyze my current portfolio allocation and identify risks" },
  { icon: Wallet, label: "Check AAPL outlook", prompt: "What is the current outlook for AAPL?" },
  { icon: Target, label: "Tax optimization", prompt: "Are there any tax-loss harvesting opportunities in my portfolio?" },
  { icon: TrendingUp, label: "Market conditions", prompt: "What are current macroeconomic conditions and how do they affect my investments?" },
]

const mockResponses: Record<string, Message["parsed"]> = {
  default: {
    insight: "Based on recent market trends, your portfolio allocation is stable with moderate upside potential.",
    explainable_reasoning: "Inflation data released today shows a cooling trend, meaning cash purchasing power erosion has slowed. Combined with stable employment figures, the current economic environment favors balanced growth strategies.",
    probability: "85%",
    confidence: "High",
    risk_score: "Low",
    disclaimer: "This is statistical intelligence, not financial advice. Do not make buy/sell decisions based on AI outputs.",
  },
  aapl: {
    insight: "Apple (AAPL) shows positive momentum indicators following their latest earnings report.",
    explainable_reasoning: "Revenue grew 12% YoY, primarily driven by Services. Hardware sales remained flat. Algorithmic analysis suggests short-term stability with 72% probability of positive momentum.",
    probability: "72%",
    confidence: "Medium (81%)",
    risk_score: "Medium (5/10)",
    disclaimer: "This is informational analysis only and not financial advice. Do not make buy/sell decisions solely based on statistical probabilities.",
  },
  portfolio: {
    insight: "Your portfolio is heavily concentrated in US equities at 87% of total assets. Diversification score: Below Optimal.",
    explainable_reasoning: "Current allocation provides maximum growth potential but increases volatility. Historical analysis shows 30% drawdown risk during market corrections. Adding 15-20% fixed-income allocation would reduce maximum drawdown to ~18% with only 2.1% annual return reduction.",
    probability: "74% (drawdown risk within 12 months)",
    confidence: "High (89%)",
    risk_score: "Moderate-High (6/10)",
    disclaimer: "Portfolio analysis is based on historical data and statistical models. Past performance does not guarantee future results.",
  },
  tax: {
    insight: "One tax-loss harvesting opportunity identified: Sell HDFC Short Term Debt Fund (current loss: ₹2,400) to offset gains.",
    explainable_reasoning: "Current holding shows -8.2% unrealized loss. Harvesting this loss before fiscal year-end could save approximately ₹720 in taxes (assuming 30% bracket). You can repurchase a similar but not substantially identical fund after 30 days.",
    probability: "91% (tax savings estimate accuracy)",
    confidence: "High",
    risk_score: "Low (wash sale rule compliance required)",
    disclaimer: "Tax optimization suggestions are for informational purposes. Consult a tax professional before executing any strategy.",
  },
}

function getMockResponse(query: string): Message["parsed"] {
  const q = query.toLowerCase()
  if (q.includes("aapl") || q.includes("apple")) return mockResponses.aapl
  if (q.includes("portfolio") || q.includes("allocation") || q.includes("diversif")) return mockResponses.portfolio
  if (q.includes("tax") || q.includes("harvest")) return mockResponses.tax
  return mockResponses.default
}

export default function ZustAiPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "",
      parsed: {
        insight: "Welcome to ZUST AI. How can I optimize your financial intelligence today?",
        explainable_reasoning: "I am constantly monitoring your portfolio and macroeconomic trends. Ask me about any stock, your portfolio allocation, or tax optimization strategies.",
        probability: "N/A",
        confidence: "High",
        risk_score: "N/A",
        disclaimer: "ZUST AI provides statistical intelligence, not financial advice. Consider consulting a licensed fiduciary.",
      },
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, loading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    setError(null)
    const userMessage: Message = { id: Date.now().toString(), role: "user", content: input }
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("http://localhost:4000/api/v1/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      })

      if (!res.ok) throw new Error("Failed to get response")

      const data = await res.json()
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
        parsed: data.data || getMockResponse(input),
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch {
      // Fallback to mock
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
        parsed: getMockResponse(input),
      }
      setMessages(prev => [...prev, assistantMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleSuggestedPrompt = (prompt: string) => {
    setInput(prompt)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard")
  }

  const regenerateLastResponse = () => {
    const lastUserMessage = [...messages].reverse().find(m => m.role === "user")
    if (lastUserMessage) {
      const lastIdx = messages.length - 1
      setMessages(prev => prev.slice(0, lastIdx))
      setInput(lastUserMessage.content)
      setTimeout(() => {
        const form = document.querySelector("form")
        if (form) form.requestSubmit()
      }, 100)
    }
  }

  const showSuggestions = messages.length <= 1

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)]">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">ZUST AI Copilot</h2>
            <p className="text-xs text-muted-foreground">Institutional-grade financial intelligence</p>
          </div>
        </div>
        <Badge variant="outline" className="text-accent border-accent/20">
          <Sparkles className="h-3 w-3 mr-1" />
          GPT-4o Powered
        </Badge>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden border-white/[0.04] bg-[#0A0A0C]">
        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 scrollbar-thin">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}>
              {m.role === "user" ? (
                <div className="bg-primary/15 border border-primary/20 text-foreground px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-[80%] text-sm">
                  {m.content}
                </div>
              ) : (
                <div className="w-full max-w-3xl space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-accent" />
                    <span className="font-semibold text-accent tracking-wider text-xs uppercase">Zust Intelligence</span>
                  </div>

                  <Card className="bg-white/[0.02] border-white/[0.06]">
                    <CardHeader className="pb-3 border-b border-white/[0.04]">
                      <CardTitle className="text-base leading-relaxed font-medium">
                        {m.parsed?.insight}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-3 space-y-3">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Explainable Reasoning</p>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {m.parsed?.explainable_reasoning}
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-3 border-t border-white/[0.04]">
                        <div className="bg-black/30 p-2.5 sm:p-3 rounded-lg border border-white/[0.04]">
                          <p className="text-[10px] text-muted-foreground uppercase font-semibold mb-0.5 flex items-center gap-1">
                            <TrendingUp className="h-2.5 w-2.5" /> Probability
                          </p>
                          <p className="text-xs sm:text-sm font-medium">{m.parsed?.probability}</p>
                        </div>
                        <div className="bg-black/30 p-2.5 sm:p-3 rounded-lg border border-white/[0.04]">
                          <p className="text-[10px] text-muted-foreground uppercase font-semibold mb-0.5">Confidence</p>
                          <p className="text-xs sm:text-sm font-medium">{m.parsed?.confidence}</p>
                        </div>
                        <div className="bg-black/30 p-2.5 sm:p-3 rounded-lg border border-warning/20">
                          <p className="text-[10px] text-muted-foreground uppercase font-semibold mb-0.5">Risk Score</p>
                          <p className="text-xs sm:text-sm font-medium text-warning">{m.parsed?.risk_score}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1 px-2"
                          onClick={() => copyToClipboard(m.parsed?.insight || "")}
                        >
                          <Copy className="h-3 w-3" /> Copy
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1 px-2"
                          onClick={regenerateLastResponse}
                        >
                          <RefreshCw className="h-3 w-3" /> Regenerate
                        </Button>
                      </div>

                      <div className="p-2.5 bg-destructive/[0.06] border border-destructive/20 rounded-lg flex items-start gap-2">
                        <ShieldAlert className="h-3.5 w-3.5 text-destructive mt-0.5 shrink-0" />
                        <p className="text-[11px] text-destructive/80 leading-relaxed">
                          {m.parsed?.disclaimer}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex justify-start animate-fade-in">
              <div className="flex items-center gap-2 text-muted-foreground bg-white/[0.03] px-4 py-2.5 rounded-full border border-white/[0.06]">
                <div className="flex gap-1">
                  <div className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce" />
                  <div className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
                  <div className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
                </div>
                <span className="text-xs font-medium">Calculating probabilities...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="flex justify-start animate-fade-in">
              <div className="flex items-center gap-2 bg-destructive/[0.06] border border-destructive/20 px-4 py-3 rounded-xl">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <p className="text-sm text-destructive">{error}</p>
                <Button variant="ghost" size="sm" onClick={() => setError(null)} className="text-xs ml-2">
                  Retry
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-white/[0.04] bg-[#08080A] p-3 sm:p-4">
          {/* Suggested prompts */}
          {showSuggestions && (
            <div className="flex flex-wrap gap-2 mb-3">
              {suggestedPrompts.map((s) => (
                <button
                  key={s.label}
                  onClick={() => handleSuggestedPrompt(s.prompt)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-xs text-muted-foreground hover:text-foreground hover:bg-white/[0.06] transition-all"
                >
                  <s.icon className="h-3 w-3" />
                  {s.label}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex gap-3 max-w-4xl mx-auto">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask ZUST AI to analyze a stock or run a scenario..."
              className="flex-1 bg-white/[0.03] border-white/[0.06] h-11 sm:h-12 text-sm focus-visible:ring-primary"
              disabled={loading}
            />
            <Button
              type="submit"
              disabled={loading || !input.trim()}
              className="h-11 w-11 sm:h-12 sm:w-12 rounded-full bg-primary hover:bg-primary/90 text-white shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <p className="text-center text-[10px] text-muted-foreground mt-2">
            ZUST AI can make mistakes. Always verify critical financial data.
          </p>
        </div>
      </Card>
    </div>
  )
}
