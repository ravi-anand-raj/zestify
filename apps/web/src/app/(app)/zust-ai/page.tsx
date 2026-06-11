"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Bot, Send, ShieldAlert, Sparkles, TrendingUp } from "lucide-react"

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  parsed?: {
    insight: string;
    explainable_reasoning: string;
    probability: string;
    confidence: string;
    risk_score: string;
    disclaimer: string;
  }
}

export default function ZustAiPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "",
      parsed: {
        insight: "Welcome to ZUST AI. How can I optimize your financial intelligence today?",
        explainable_reasoning: "I am constantly monitoring your portfolio and macroeconomic trends.",
        probability: "N/A",
        confidence: "High",
        risk_score: "N/A",
        disclaimer: "ZUST AI provides statistical intelligence, not financial advice. Consider consulting a licensed fiduciary."
      }
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    // Mock API Call to ZUST AI Backend
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
        parsed: {
          insight: "Reliance currently shows a 72% probability score with positive momentum indicators.",
          explainable_reasoning: "Recent earnings reports indicate a 14% revenue growth in the digital services sector, offset slightly by flat retail margins. Combined with current interest rate holds, mathematical models suggest upward momentum.",
          probability: "72% (Based on Monte Carlo analysis of last 10 years)",
          confidence: "Medium (81%) - Relies on forward-looking macro assumptions.",
          risk_score: "Medium (5/10) - Sector concentration risk is present.",
          disclaimer: "This is informational analysis only and not financial advice. Do not make buy/sell decisions solely based on statistical probabilities."
        }
      };
      setMessages(prev => [...prev, assistantMessage]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Bot className="h-8 w-8 text-primary" />
          ZUST AI Copilot
        </h2>
        <p className="text-muted-foreground mt-1">Your institutional-grade financial intelligence engine.</p>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden border-white/5 bg-black/40">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role === 'user' ? (
                <div className="bg-primary/20 border border-primary/30 text-white px-5 py-3 rounded-2xl rounded-tr-sm max-w-[80%]">
                  {m.content}
                </div>
              ) : (
                <div className="w-full max-w-3xl space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-5 w-5 text-accent" />
                    <span className="font-bold text-accent tracking-wider text-sm uppercase">Zust Intelligence</span>
                  </div>
                  
                  <Card className="bg-card/50 border-white/10 shadow-2xl">
                    <CardHeader className="pb-3 border-b border-white/5">
                      <CardTitle className="text-lg leading-relaxed">
                        {m.parsed?.insight}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-1">Explainable Reasoning</p>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {m.parsed?.explainable_reasoning}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
                        <div className="bg-black/50 p-3 rounded-lg border border-white/5">
                          <p className="text-xs text-gray-500 uppercase font-semibold mb-1 flex items-center"><TrendingUp className="h-3 w-3 mr-1"/> Probability</p>
                          <p className="text-sm font-medium text-white">{m.parsed?.probability}</p>
                        </div>
                        <div className="bg-black/50 p-3 rounded-lg border border-white/5">
                          <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Confidence</p>
                          <p className="text-sm font-medium text-white">{m.parsed?.confidence}</p>
                        </div>
                        <div className="bg-black/50 p-3 rounded-lg border border-warning/20">
                          <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Risk Score</p>
                          <p className="text-sm font-medium text-warning">{m.parsed?.risk_score}</p>
                        </div>
                      </div>

                      <div className="mt-4 p-3 bg-red-900/10 border border-red-500/20 rounded-lg flex items-start gap-2">
                        <ShieldAlert className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-red-300/80 leading-relaxed">
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
            <div className="flex justify-start">
              <div className="flex items-center gap-2 text-muted-foreground bg-white/5 px-4 py-2 rounded-full border border-white/10">
                <div className="h-2 w-2 bg-primary rounded-full animate-bounce"></div>
                <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                <span className="text-xs ml-2 font-medium">ZUST AI is calculating probabilities...</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-white/5 bg-black/50 backdrop-blur-lg">
          <form onSubmit={handleSubmit} className="flex gap-4 max-w-4xl mx-auto">
            <Input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask ZUST AI to run a scenario or analyze a stock..." 
              className="flex-1 bg-white/5 border-white/10 h-14 text-base focus-visible:ring-accent"
              disabled={loading}
            />
            <Button type="submit" disabled={loading || !input.trim()} className="h-14 w-14 rounded-full bg-accent hover:bg-accent/90 text-black">
              <Send className="h-5 w-5" />
            </Button>
          </form>
          <p className="text-center text-[10px] text-muted-foreground mt-3">
            ZUST AI can make mistakes. Always verify critical financial data.
          </p>
        </div>
      </Card>
    </div>
  )
}
