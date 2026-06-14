"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Command } from "cmdk"
import { Search, Bot, LayoutDashboard, Wallet, Target, Activity } from "lucide-react"
import { useDebounce } from "@/hooks/use-debounce"

export function CommandMenu() {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const debouncedQuery = useDebounce(query, 300)
  const [results, setResults] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  React.useEffect(() => {
    async function search() {
      if (debouncedQuery.length < 2) {
        setResults([])
        return
      }
      setLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)
        const data = await res.json()
        if (data.success) {
          setResults(data.data)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    search()
  }, [debouncedQuery])

  const handleSelect = (action: () => void) => {
    setOpen(false)
    action()
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 h-8 px-3 text-muted-foreground hover:text-foreground bg-muted/50 dark:bg-white/[0.03] border border-border rounded-full"
        aria-label="Search"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="text-xs">Search stocks, AI...</span>
        <kbd className="ml-2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted/50 dark:bg-white/5 px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">&#8984;K</span>
        </kbd>
      </button>

      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Global Command Menu"
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden"
      >
        <div className="flex items-center border-b border-border px-3">
          <Search className="h-4 w-4 shrink-0 opacity-50 mr-2" />
          <Command.Input
            value={query}
            onValueChange={setQuery}
            placeholder="Search for AAPL, TSLA, or navigate..."
            className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <Command.List className="max-h-[300px] overflow-y-auto p-2">
          <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
            {loading ? "Searching..." : "No results found."}
          </Command.Empty>

          {results.length > 0 && (
            <Command.Group heading="Market Data" className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
              {results.map((result) => (
                <Command.Item
                  key={result.symbol}
                  onSelect={() => handleSelect(() => {
                    // Navigate to Zust AI and pre-fill the search
                    // Or in a real app, go to /symbol/[ticker]
                    router.push(`/zust-ai?q=${result.symbol}`)
                  })}
                  className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-muted aria-selected:text-foreground hover:bg-muted"
                >
                  <Activity className="h-4 w-4 mr-2 opacity-70 text-primary" />
                  <div className="flex flex-col">
                    <span className="font-semibold text-foreground">{result.symbol}</span>
                    <span className="text-[10px] text-muted-foreground">{result.shortname} &bull; {result.exchDisp}</span>
                  </div>
                </Command.Item>
              ))}
            </Command.Group>
          )}

          <Command.Group heading="Navigation" className="px-2 py-1.5 text-xs font-medium text-muted-foreground mt-2">
            <Command.Item onSelect={() => handleSelect(() => router.push('/dashboard'))} className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-muted aria-selected:text-foreground hover:bg-muted">
              <LayoutDashboard className="h-4 w-4 mr-2 opacity-70" /> Dashboard
            </Command.Item>
            <Command.Item onSelect={() => handleSelect(() => router.push('/zust-ai'))} className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-muted aria-selected:text-foreground hover:bg-muted">
              <Bot className="h-4 w-4 mr-2 opacity-70 text-primary" /> ZUST AI Copilot
            </Command.Item>
            <Command.Item onSelect={() => handleSelect(() => router.push('/portfolio'))} className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-muted aria-selected:text-foreground hover:bg-muted">
              <Wallet className="h-4 w-4 mr-2 opacity-70" /> Portfolio Intelligence
            </Command.Item>
            <Command.Item onSelect={() => handleSelect(() => router.push('/goals'))} className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-muted aria-selected:text-foreground hover:bg-muted">
              <Target className="h-4 w-4 mr-2 opacity-70" /> Goal Planner
            </Command.Item>
          </Command.Group>
        </Command.List>
        
        {/* Cmdk Dialog overlay styled purely through classNames for Next.js app router ease if needed, 
            but Cmdk native handles overlay through its own CSS usually. We can just add simple CSS to globals. */}
      </Command.Dialog>
    </>
  )
}
