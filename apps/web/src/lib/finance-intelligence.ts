import YahooFinanceModule from "yahoo-finance2"
import { getMcpTools } from "./mcp-client"

// yahoo-finance2 v3 requires instantiation; v2 interop fallback
let yahooFinance: any
try {
  // v3 style – constructor
  if (typeof YahooFinanceModule === "function") {
    yahooFinance = new (YahooFinanceModule as any)()
  } else if ((YahooFinanceModule as any).default) {
    const Mod = (YahooFinanceModule as any).default
    yahooFinance = typeof Mod === "function" ? new Mod() : Mod
  } else {
    yahooFinance = YahooFinanceModule
  }
} catch {
  yahooFinance = (YahooFinanceModule as any).default || YahooFinanceModule
}

export type FinanceTopic = "market" | "business" | "personal" | "watchlist" | "technology" | "economy"

export type FinanceUpdate = {
  id: string
  title: string
  publisher: string
  link: string
  category: string
  relatedSymbol?: string
  publishedAt?: string
  summary?: string
}

export type StockQuote = {
  symbol: string
  name: string
  price: number
  currency: string
  changePercent: number
  dayHigh?: number
  dayLow?: number
  volume?: number
  marketCap?: number
  fiftyTwoWeekHigh?: number
  fiftyTwoWeekLow?: number
}

export type AiInsightResponse = {
  insight: string
  explainable_reasoning: string
  probability: string
  confidence: string
  risk_score: string
  disclaimer: string
  meta?: {
    mode: "groq-enhanced" | "basic" | "personal-api" | "mcp-enhanced"
    sources?: Array<{ title: string; link?: string; publisher?: string }>
    symbol?: string
    relatedTickers?: string[]
  }
}

const DISCLAIMER =
  "ZUST AI provides educational statistical intelligence, not financial advice. Verify live data before making financial decisions."

const TOPIC_QUERIES: Record<string, string> = {
  market: "stock market economy inflation interest rates",
  business: "business earnings companies economy",
  personal: "personal finance investing saving tax planning",
  watchlist: "AAPL MSFT TSLA NVDA market news",
  technology: "technology stocks AI semiconductor cloud computing",
  economy: "GDP inflation interest rates economic growth",
}

const SYMBOL_ALIASES: Array<[RegExp, string]> = [
  [/\b(aapl|apple)\b/i, "AAPL"],
  [/\b(msft|microsoft)\b/i, "MSFT"],
  [/\b(tsla|tesla)\b/i, "TSLA"],
  [/\b(nvda|nvidia)\b/i, "NVDA"],
  [/\b(googl|google|alphabet)\b/i, "GOOGL"],
  [/\b(amzn|amazon)\b/i, "AMZN"],
  [/\b(meta|facebook)\b/i, "META"],
  [/\b(nflx|netflix)\b/i, "NFLX"],
  [/\b(reliance)\b/i, "RELIANCE.NS"],
  [/\b(infosys|infy)\b/i, "INFY.NS"],
  [/\b(tcs)\b/i, "TCS.NS"],
  [/\b(hdfc)\b/i, "HDFCBANK.NS"],
  [/\b(wipro)\b/i, "WIPRO.NS"],
  [/\b(sbi|state bank)\b/i, "SBIN.NS"],
  [/\b(icici)\b/i, "ICICIBANK.NS"],
  [/\b(bajaj)\b/i, "BAJFINANCE.NS"],
  [/\b(nifty)\b/i, "^NSEI"],
  [/\b(sensex)\b/i, "^BSESN"],
  [/\b(s\s*&?\s*p\s*500|spy)\b/i, "^GSPC"],
  [/\b(dow|djia)\b/i, "^DJI"],
  [/\b(nasdaq|qqq)\b/i, "^IXIC"],
  [/\b(bitcoin|btc)\b/i, "BTC-USD"],
  [/\b(ethereum|eth)\b/i, "ETH-USD"],
]

const SYMBOL_STOP_WORDS = new Set([
  "AI", "API", "ETF", "GDP", "CPI", "IPO", "USD", "INR", "SIP", "EMI",
  "EPS", "PE", "TAX", "ROI", "ROE", "SWP", "NAV", "AUM", "KYC", "AMC",
  "CAGR", "XIRR", "FD", "RD", "PPF", "NPS", "ELSS",
])

export function hasUsableGroqKey() {
  const key = process.env.GROQ_API_KEY?.trim() || "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"
  if (!key) return false
  if (key === "your_groq_api_key_here") return false
  if (key.length < 10) return false
  return true
}

export function extractLikelySymbol(query: string): string | null {
  for (const [pattern, symbol] of SYMBOL_ALIASES) {
    if (pattern.test(query)) return symbol
  }

  const candidates = query.match(/\b[A-Z][A-Z0-9.]{0,8}\b/g) || []
  return candidates.find((candidate) => !SYMBOL_STOP_WORDS.has(candidate)) || null
}

/** Extract ALL tickers from a query for multi-stock comparison */
export function extractAllSymbols(query: string): string[] {
  const symbols: string[] = []
  for (const [pattern, symbol] of SYMBOL_ALIASES) {
    if (pattern.test(query) && !symbols.includes(symbol)) {
      symbols.push(symbol)
    }
  }
  const candidates = query.match(/\b[A-Z][A-Z0-9.]{0,8}\b/g) || []
  for (const c of candidates) {
    if (!SYMBOL_STOP_WORDS.has(c) && !symbols.includes(c)) {
      symbols.push(c)
    }
  }
  return symbols
}

export async function fetchStockQuote(symbol: string): Promise<StockQuote | null> {
  try {
    const quote = await yahooFinance.quote(symbol.toUpperCase())

    if (!quote?.symbol || quote.regularMarketPrice == null) {
      return null
    }

    return {
      symbol: quote.symbol,
      name: quote.shortName || quote.longName || quote.symbol,
      price: Number(quote.regularMarketPrice),
      currency: quote.currency || "USD",
      changePercent: Number(quote.regularMarketChangePercent || 0),
      dayHigh: quote.regularMarketDayHigh,
      dayLow: quote.regularMarketDayLow,
      volume: quote.regularMarketVolume,
      marketCap: quote.marketCap,
      fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh,
      fiftyTwoWeekLow: quote.fiftyTwoWeekLow,
    }
  } catch (error) {
    console.error("Quote fetch failed:", error)
    return null
  }
}

/** Fetch multiple stock quotes in parallel */
export async function fetchMultipleQuotes(symbols: string[]): Promise<StockQuote[]> {
  const results = await Promise.allSettled(symbols.map(s => fetchStockQuote(s)))
  return results
    .filter((r): r is PromiseFulfilledResult<StockQuote> => r.status === "fulfilled" && r.value !== null)
    .map(r => r.value)
}

/** Fetch market overview — major indices */
export async function fetchMarketOverview(): Promise<StockQuote[]> {
  const indices = ["^GSPC", "^DJI", "^IXIC", "^NSEI", "^BSESN"]
  return fetchMultipleQuotes(indices)
}

export async function fetchFinanceUpdates(topic: string = "market", limit = 8): Promise<FinanceUpdate[]> {
  const knownTopic = getKnownTopic(topic)
  const categoryTopic = knownTopic || classifyTopic(topic)
  const query = knownTopic ? TOPIC_QUERIES[knownTopic] : topic || TOPIC_QUERIES.market

  try {
    const result = await yahooFinance.search(query, { newsCount: limit })
    const news = Array.isArray(result?.news) ? result.news : []

    return news.slice(0, limit).map((item: any, index: number) => {
      const relatedSymbol = Array.isArray(item.relatedTickers) ? item.relatedTickers[0] : undefined
      const publishTime =
        typeof item.providerPublishTime === "number"
          ? new Date(item.providerPublishTime * 1000).toISOString()
          : undefined

      return {
        id: item.uuid || `${categoryTopic}-${index}-${item.title || "update"}`,
        title: item.title || "Market update",
        publisher: item.publisher || "Yahoo Finance",
        link: item.link || "https://finance.yahoo.com",
        category: toCategoryLabel(categoryTopic),
        relatedSymbol,
        publishedAt: publishTime,
        summary: item.summary,
      }
    })
  } catch (error) {
    console.error("Finance updates fetch failed:", error)
    return []
  }
}

/** Fetch news from multiple categories for the News Hub */
export async function fetchCategorizedNews(limit = 6): Promise<Record<string, FinanceUpdate[]>> {
  const categories: FinanceTopic[] = ["market", "business", "technology", "economy"]
  const results = await Promise.allSettled(
    categories.map(cat => fetchFinanceUpdates(cat, limit))
  )

  const categorized: Record<string, FinanceUpdate[]> = {}
  categories.forEach((cat, i) => {
    const result = results[i]
    categorized[cat] = result.status === "fulfilled" ? result.value : []
  })

  return categorized
}

export async function buildBasicFinanceInsight(query: string): Promise<AiInsightResponse> {
  const symbols = extractAllSymbols(query)

  // Multi-stock comparison
  if (symbols.length >= 2) {
    return buildMultiStockComparison(query, symbols)
  }

  // Single stock
  const symbol = symbols[0] || extractLikelySymbol(query)
  if (symbol) {
    return buildQuoteBackedInsight(query, symbol)
  }

  // Special commands
  const lowerQuery = query.toLowerCase().trim()
  if (lowerQuery.startsWith("/market") || lowerQuery.startsWith("/trending") || lowerQuery === "market overview") {
    return buildMarketOverviewInsight()
  }

  const topic = classifyTopic(query)
  const updates = await fetchFinanceUpdates(topic, 4)

  if (updates.length > 0) {
    const headlines = updates
      .slice(0, 3)
      .map((item, index) => `${index + 1}. ${item.title} (${item.publisher})`)
      .join(" ")

    return {
      insight: `📊 Live Intelligence: ${updates[0].title}`,
      explainable_reasoning: `I scanned recent ${toCategoryLabel(topic).toLowerCase()} updates and found the strongest current signal in the first headline. For a beginner-friendly next step, separate news from action: identify whether the update affects income, interest rates, company earnings, or your own savings plan before changing allocations.\n\n**Recent headlines:**\n${updates.slice(0, 3).map((item, i) => `${i + 1}. ${item.title}`).join("\n")}`,
      probability: "Directional, not numeric",
      confidence: "Medium",
      risk_score: topic === "business" ? "Medium" : "Low to Medium",
      disclaimer: DISCLAIMER,
      meta: {
        mode: "basic",
        sources: updates.map((item) => ({
          title: item.title,
          link: item.link,
          publisher: item.publisher,
        })),
      },
    }
  }

  return buildEducationalInsight(query)
}

async function buildMultiStockComparison(query: string, symbols: string[]): Promise<AiInsightResponse> {
  const quotes = await fetchMultipleQuotes(symbols.slice(0, 5))

  if (quotes.length === 0) {
    return {
      insight: `Could not fetch data for the requested tickers: ${symbols.join(", ")}`,
      explainable_reasoning: "None of the requested tickers returned usable data. Verify ticker symbols and try again.",
      probability: "N/A",
      confidence: "None",
      risk_score: "Unknown",
      disclaimer: DISCLAIMER,
      meta: { mode: "basic" },
    }
  }

  const comparison = quotes.map(q => {
    const moveDir = q.changePercent >= 0 ? "📈" : "📉"
    const priceStr = formatMoney(q.price, q.currency)
    const changeStr = formatPercent(q.changePercent)
    return `**${q.symbol}** (${q.name}): ${priceStr} ${moveDir} ${changeStr}`
  }).join("\n")

  const bestPerformer = quotes.reduce((best, q) => q.changePercent > best.changePercent ? q : best, quotes[0])
  const worstPerformer = quotes.reduce((worst, q) => q.changePercent < worst.changePercent ? q : worst, quotes[0])

  return {
    insight: `📊 Multi-Stock Comparison: ${quotes.map(q => q.symbol).join(" vs ")}`,
    explainable_reasoning: `**Today's Performance:**\n${comparison}\n\n**Key Takeaway:** ${bestPerformer.symbol} is the strongest performer today (${formatPercent(bestPerformer.changePercent)}), while ${worstPerformer.symbol} is the weakest (${formatPercent(worstPerformer.changePercent)}).\n\n⚠️ Daily movements don't indicate long-term value. Compare fundamentals (P/E, revenue growth, debt levels) before making allocation decisions.`,
    probability: "Comparative, not predictive",
    confidence: "High (live data)",
    risk_score: quotes.some(q => Math.abs(q.changePercent) > 3) ? "High volatility detected" : "Normal range",
    disclaimer: DISCLAIMER,
    meta: {
      mode: "basic",
      relatedTickers: quotes.map(q => q.symbol),
    },
  }
}

async function buildMarketOverviewInsight(): Promise<AiInsightResponse> {
  const indices = await fetchMarketOverview()
  const updates = await fetchFinanceUpdates("market", 3)

  if (indices.length === 0) {
    return buildEducationalInsight("market overview")
  }

  const overview = indices.map(q => {
    const emoji = q.changePercent >= 0 ? "🟢" : "🔴"
    return `${emoji} **${q.name}**: ${formatMoney(q.price, q.currency)} (${formatPercent(q.changePercent)})`
  }).join("\n")

  const headlineText = updates.length > 0
    ? `\n\n**Top Headlines:**\n${updates.slice(0, 3).map((u, i) => `${i + 1}. ${u.title}`).join("\n")}`
    : ""

  return {
    insight: "🌍 Global Market Overview — Live Indices",
    explainable_reasoning: `**Current Market Status:**\n${overview}${headlineText}\n\n**Beginner Action:** Markets move daily — focus on your long-term allocation, not short-term index swings.`,
    probability: "Live snapshot",
    confidence: "High (live data)",
    risk_score: indices.some(q => Math.abs(q.changePercent) > 2) ? "Elevated volatility" : "Normal",
    disclaimer: DISCLAIMER,
    meta: {
      mode: "basic",
      sources: updates.map(u => ({ title: u.title, link: u.link, publisher: u.publisher })),
      relatedTickers: indices.map(q => q.symbol),
    },
  }
}

async function buildQuoteBackedInsight(query: string, symbol: string): Promise<AiInsightResponse> {
  const [quote, updates, mcpTools] = await Promise.all([
    fetchStockQuote(symbol),
    fetchFinanceUpdates(symbol, 4),
    getMcpTools().catch(() => ({}) as any)
  ])

  if (!quote) {
    return {
      insight: `Could not verify live quote data for ${symbol}.`,
      explainable_reasoning:
        "The live quote lookup did not return usable data, so I am not guessing price or momentum. Try the exact ticker symbol, or ask for a general business/finance explanation instead.",
      probability: "N/A",
      confidence: "None",
      risk_score: "Unknown",
      disclaimer: DISCLAIMER,
      meta: { mode: "basic", symbol },
    }
  }

  const moveText = formatPercent(quote.changePercent)
  const priceText = formatMoney(quote.price, quote.currency)
  const riskScore = getRiskScore(quote.changePercent)
  const momentumLabel = getMomentumLabel(quote.changePercent)
  const moveEmoji = quote.changePercent >= 0 ? "📈" : "📉"

  const rangeText = quote.dayLow && quote.dayHigh
    ? `${formatMoney(quote.dayLow, quote.currency)} — ${formatMoney(quote.dayHigh, quote.currency)}`
    : "unavailable"

  const weekRangeText = quote.fiftyTwoWeekLow && quote.fiftyTwoWeekHigh
    ? `${formatMoney(quote.fiftyTwoWeekLow, quote.currency)} — ${formatMoney(quote.fiftyTwoWeekHigh, quote.currency)}`
    : null

  const volumeText = quote.volume ? `${(quote.volume / 1_000_000).toFixed(1)}M` : "N/A"

  const headlineSection = updates.length > 0
    ? `\n\n**Recent Headlines:**\n${updates.slice(0, 3).map((item, i) => `${i + 1}. ${item.title} _(${item.publisher})_`).join("\n")}`
    : "\nNo recent headlines found for this ticker."

  let avData = "";
  if (mcpTools.get_company_overview) {
    try {
      const result = await mcpTools.get_company_overview.execute({ symbol }, { toolCallId: "manual", messages: [] });
      const parsed = JSON.parse(result.content[0].text);
      if (parsed.PERatio && parsed.PERatio !== "None") {
        avData = `\n\n**Alpha Vantage Real-Time Fundamentals:**\n• **P/E Ratio:** ${parsed.PERatio}\n• **Market Cap:** $${(parsed.MarketCapitalization / 1e9).toFixed(2)}B\n• **Analyst Target:** $${parsed.AnalystTargetPrice || 'N/A'}`;
      }
    } catch (e) {
      console.error("Alpha Vantage fetch failed in basic mode:", e);
    }
  }

  return {
    insight: `${moveEmoji} ${quote.name} (${quote.symbol}): ${priceText} · ${moveText} today`,
    explainable_reasoning: `**Live Market Data:**\n• **Price:** ${priceText} (${moveText})\n• **Day Range:** ${rangeText}\n${weekRangeText ? `• **52-Week Range:** ${weekRangeText}\n` : ""}• **Volume:** ${volumeText}\n• **Momentum:** ${momentumLabel}\n${headlineSection}${avData}\n\n**Beginner Action:** Don't act on one day's movement. Check this stock's fundamentals (P/E ratio, revenue trend, debt) and its weight in your overall portfolio before making changes.`,
    probability: quote.changePercent >= 0 ? "Moderate positive momentum" : "Elevated downside watch",
    confidence: updates.length > 0 ? "High (live data + news)" : "Medium (live data only)",
    risk_score: riskScore,
    disclaimer: DISCLAIMER,
    meta: {
      mode: "basic",
      symbol: quote.symbol,
      sources: updates.map((item) => ({
        title: item.title,
        link: item.link,
        publisher: item.publisher,
      })),
    },
  }
}

function buildEducationalInsight(query: string): AiInsightResponse {
  const lower = query.toLowerCase()

  if (lower.includes("tax") || lower.includes("harvest")) {
    return {
      insight: "📋 Tax Strategy: Key concepts for beginner investors",
      explainable_reasoning:
        "**Tax-Loss Harvesting Basics:**\n• Sell securities at a loss to offset capital gains\n• Maintain 30-day wash-sale buffer (don't repurchase the same asset)\n• Track realized vs unrealized gains separately\n• Consult a qualified tax professional for your specific situation\n\n**Key Terms:** Short-term capital gains (held < 1 year) are taxed at higher rates than long-term gains.",
      probability: "N/A",
      confidence: "Medium",
      risk_score: "Medium",
      disclaimer: DISCLAIMER,
      meta: { mode: "basic" },
    }
  }

  if (lower.includes("business") || lower.includes("company") || lower.includes("strategy")) {
    return {
      insight: "🏢 Business Analysis Framework for Beginners",
      explainable_reasoning:
        "**Four Pillars of Business Quality:**\n1. **Revenue Durability** — Is demand recurring or one-time?\n2. **Margins** — Does the company have pricing power?\n3. **Debt Levels** — Is leverage manageable relative to cash flow?\n4. **Free Cash Flow** — Does the business generate real cash after expenses?\n\nA resilient business usually scores well on all four. Compare these basics before looking at short-term price action.",
      probability: "N/A",
      confidence: "Medium",
      risk_score: "Low to Medium",
      disclaimer: DISCLAIMER,
      meta: { mode: "basic" },
    }
  }

  if (lower.includes("portfolio") || lower.includes("allocation") || lower.includes("diversif")) {
    return {
      insight: "📊 Portfolio Diversification: The Foundation of Risk Management",
      explainable_reasoning:
        "**Core Diversification Principles:**\n1. **Asset Classes** — Spread across equities, bonds, and cash\n2. **Geography** — Don't concentrate in one country's market\n3. **Sectors** — Balance tech, healthcare, finance, consumer goods\n4. **Time** — Use SIP/DCA to spread entry points\n\n**Rule of Thumb:** No single stock should be more than 5-10% of your portfolio. Review your allocation quarterly.",
      probability: "N/A",
      confidence: "High",
      risk_score: "Low",
      disclaimer: DISCLAIMER,
      meta: { mode: "basic" },
    }
  }

  if (lower.includes("sip") || lower.includes("mutual fund") || lower.includes("invest")) {
    return {
      insight: "💰 Systematic Investment Plan (SIP): A Beginner's Best Friend",
      explainable_reasoning:
        "**Why SIP Works:**\n1. **Rupee Cost Averaging** — Buy more units when prices are low, fewer when high\n2. **Discipline** — Automates the saving habit\n3. **Compounding** — Even small amounts grow exponentially over time\n4. **Flexibility** — Start with as little as ₹500/month\n\n**Start with:** A broad-market index fund (like Nifty 50 or S&P 500) before exploring sector-specific funds.",
      probability: "N/A",
      confidence: "High",
      risk_score: "Low",
      disclaimer: DISCLAIMER,
      meta: { mode: "basic" },
    }
  }

  return {
    insight: "✨ ZUST AI — Live Intelligence Active",
    explainable_reasoning:
      "**I can help you with:**\n• 📈 **Stock Analysis** — Ask about any ticker (e.g., 'AAPL outlook', 'RELIANCE price')\n• 📊 **Market Overview** — Type '/market' for a global indices snapshot\n• ⚖️ **Compare Stocks** — Mention multiple tickers (e.g., 'AAPL vs MSFT vs GOOGL')\n• 📋 **Learn Concepts** — Ask about SIP, diversification, tax harvesting, portfolio allocation\n• 📰 **News Context** — Ask about any market event or headline\n\nAll data is sourced from live Yahoo Finance feeds. No paid API key required.",
    probability: "N/A",
    confidence: "High",
    risk_score: "Context dependent",
    disclaimer: DISCLAIMER,
    meta: { mode: "basic" },
  }
}

function getKnownTopic(topic: string): FinanceTopic | null {
  const lower = topic.toLowerCase()
  if (lower === "market") return "market"
  if (lower === "business") return "business"
  if (lower === "personal" || lower === "personal-finance") return "personal"
  if (lower === "watchlist") return "watchlist"
  if (lower === "technology" || lower === "tech") return "technology"
  if (lower === "economy") return "economy"
  return null
}

function classifyTopic(query: string): FinanceTopic {
  const lower = query.toLowerCase()
  if (lower.includes("business") || lower.includes("earnings") || lower.includes("company")) return "business"
  if (lower.includes("tech") || lower.includes("ai") || lower.includes("semiconductor")) return "technology"
  if (lower.includes("economy") || lower.includes("gdp") || lower.includes("inflation")) return "economy"
  if (lower.includes("tax") || lower.includes("saving") || lower.includes("budget") || lower.includes("personal")) {
    return "personal"
  }
  if (lower.includes("watchlist")) return "watchlist"
  return "market"
}

function toCategoryLabel(topic: FinanceTopic | string) {
  const labels: Record<string, string> = {
    market: "Market",
    business: "Business",
    personal: "Personal Finance",
    watchlist: "Watchlist",
    technology: "Technology",
    economy: "Economy",
  }

  return labels[topic] || "Market"
}

function getMomentumLabel(changePercent: number) {
  if (changePercent > 3) return "Strong bullish 🟢"
  if (changePercent > 1.5) return "Moderately positive 🟢"
  if (changePercent > 0) return "Slightly positive ↗️"
  if (changePercent > -1.5) return "Slightly negative ↘️"
  if (changePercent > -3) return "Moderately negative 🔴"
  return "Strong bearish 🔴"
}

function getRiskScore(changePercent: number) {
  const absChange = Math.abs(changePercent)
  if (absChange >= 4) return "High"
  if (absChange >= 1.5) return "Medium"
  return "Low to Medium"
}

function formatMoney(value: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(value)
  } catch {
    return `${currency} ${value.toFixed(2)}`
  }
}

function formatPercent(value: number) {
  const sign = value > 0 ? "+" : ""
  return `${sign}${value.toFixed(2)}%`
}
