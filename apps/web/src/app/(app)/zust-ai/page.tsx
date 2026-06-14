"use client"

import { useState, useRef, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bot, Send, Sparkles, Copy, CircleAlert as AlertCircle, BarChart3, Wallet, Target, Globe, Activity } from "lucide-react"
import { toast } from "sonner"
import { useChat } from "@ai-sdk/react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

const suggestedPrompts = [
  { icon: BarChart3, label: "Analyze AAPL", prompt: "What is the current outlook for AAPL?" },
  { icon: Wallet, label: "Compare stocks", prompt: "Compare AAPL vs MSFT" },
  { icon: Globe, label: "Market overview", prompt: "What are the top market movers today?" },
  { icon: Target, label: "Earnings Report", prompt: "Get earnings data for NVDA" },
]

const quickCommands = [
  { label: "Market Movers", desc: "Global indices overview" },
  { label: "Trending News", desc: "Trending market news" },
]

function ZustAiContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams?.get("q") || ""

  const [input, setInput] = useState("")
  const { messages, sendMessage, status } = useChat({
    api: "/api/ai/chat"
  } as any)

  const isLoading = status === "submitted" || status === "streaming"

  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    const currentInput = input
    setInput("")
    sendMessage({ role: "user", parts: [{ type: "text", text: currentInput }] })
  }

  // Auto-submit if there's an initial query from URL
  useEffect(() => {
    if (initialQuery && messages.length === 0) {
      sendMessage({ role: "user", parts: [{ type: "text", text: initialQuery }] })
    }
  }, [initialQuery, messages.length, sendMessage])

  const handleSuggestedPrompt = (prompt: string) => {
    if (isLoading) return
    sendMessage({ role: "user", parts: [{ type: "text", text: prompt }] })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard")
  }

  const showSuggestions = messages.length === 0

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)]">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
            <div className="absolute inset-0 rounded-2xl bg-indigo-500/10 blur-xl"></div>
            <Bot className="h-6 w-6 text-indigo-400 relative z-10" />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">ZUST AI Copilot</h2>
            <p className="text-xs text-indigo-200/60 font-medium tracking-wide uppercase">Institutional-Grade Financial Intelligence</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 bg-emerald-500/10 gap-2 px-3 py-1 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Real-Time Pipeline
          </Badge>
        </div>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden border-indigo-500/20 bg-black/40 backdrop-blur-2xl shadow-2xl relative">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />
        
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 scrollbar-thin">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}>
              {m.role === "user" ? (
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border border-indigo-400/30 shadow-[0_4px_14px_0_rgba(99,102,241,0.39)] px-5 py-3 rounded-2xl rounded-tr-sm max-w-[80%] text-sm font-medium">
                  {m.parts?.map((p: any, i: number) => p.type === 'text' ? <span key={i}>{p.text}</span> : null)}
                </div>
              ) : (
                <div className="w-full max-w-3xl space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-indigo-500/20 border border-indigo-500/30 shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                      <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                    </div>
                    <span className="font-bold text-indigo-300 tracking-widest text-[10px] uppercase">Zust Intelligence</span>
                  </div>

                  <Card className="bg-white/5 backdrop-blur-md border-indigo-500/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
                    <CardContent className="pt-4 space-y-4">
                      {m.parts?.map((part: any, idx: number) => {
                        if (part.type === 'tool-invocation') {
                          return (
                            <div key={idx} className="flex items-center gap-2 text-xs text-indigo-300/80 bg-indigo-500/5 border border-indigo-500/20 p-2 rounded-lg">
                              <Activity className="h-3 w-3 animate-pulse" />
                              {part.toolInvocation.state === "result" ? (
                                <span>Extracted Live Data via <strong>{part.toolInvocation.toolName}</strong></span>
                              ) : (
                                <span>Fetching Live Data via <strong>{part.toolInvocation.toolName}</strong>...</span>
                              )}
                            </div>
                          )
                        }
                        if (part.type === 'text' && part.text) {
                          return (
                            <div key={idx} className="text-indigo-50/90 markdown-wrapper">
                              <div className="prose prose-invert prose-indigo max-w-none prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-indigo-500/30 prose-td:border-indigo-500/20 prose-th:border-indigo-500/30 prose-th:bg-indigo-500/10 text-sm">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                  {part.text}
                                </ReactMarkdown>
                              </div>
                              <div className="flex items-center gap-2 pt-4 border-t border-border mt-4">
                                <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1 px-2" onClick={() => copyToClipboard(part.text)}>
                                  <Copy className="h-3 w-3" /> Copy
                                </Button>
                              </div>
                            </div>
                          )
                        }
                        return null;
                      })}
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          ))}
          {isLoading && messages.length > 0 && messages[messages.length - 1]?.role === "user" && (
            <div className="flex justify-start animate-fade-in">
              <div className="flex items-center gap-2 text-muted-foreground bg-muted/30 px-4 py-2.5 rounded-full border border-border">
                <div className="flex gap-1">
                  <div className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce" />
                  <div className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
                  <div className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
                </div>
                <span className="text-xs font-medium">Orchestrating AI Agent...</span>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-indigo-500/20 bg-black/60 backdrop-blur-xl p-4 sm:p-6 z-10">
          {showSuggestions && (
            <div className="space-y-3 mb-4 max-w-4xl mx-auto">
              <div className="flex flex-wrap gap-2.5">
                {suggestedPrompts.map((s) => (
                  <button key={s.label} onClick={() => handleSuggestedPrompt(s.prompt)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-indigo-100/70 hover:text-white hover:bg-indigo-500/20 hover:border-indigo-500/40 transition-all duration-300">
                    <s.icon className="h-3.5 w-3.5" />
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="flex gap-3 max-w-4xl mx-auto relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about the markets..."
              className="relative flex-1 bg-black/50 backdrop-blur-sm border-white/10 h-14 text-base focus-visible:ring-indigo-500/50 rounded-2xl placeholder:text-indigo-200/30 text-white shadow-inner"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="relative h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white shrink-0 shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all duration-300 border border-white/10"
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
          <p className="text-center text-[11px] font-medium tracking-wide text-indigo-200/40 mt-4 uppercase">
            Powered by Groq 70b • Live data via Alpha Vantage & Finnhub
          </p>
        </div>
      </Card>
    </div>
  )
}

export default function ZustAiPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-[50vh] text-muted-foreground">Loading AI Copilot...</div>}>
      <ZustAiContent />
    </Suspense>
  )
}
