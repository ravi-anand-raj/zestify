import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ListToolsRequestSchema, CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";

const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

if (!API_KEY) {
  console.error("Error: ALPHA_VANTAGE_API_KEY environment variable is required.");
  process.exit(1);
}

const server = new Server({
  name: "alpha-vantage-mcp",
  version: "1.0.0",
}, {
  capabilities: {
    tools: {}
  }
});

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "getCompanyOverview",
        description: "Fetches fundamental data for a company, including P/E ratio, Market Cap, 52-week highs/lows, EBITDA, etc.",
        inputSchema: {
          type: "object",
          properties: { symbol: { type: "string" } },
          required: ["symbol"]
        }
      },
      {
        name: "getStockQuote",
        description: "Fetches the absolute latest price, volume, and daily change for a specific stock ticker.",
        inputSchema: {
          type: "object",
          properties: { symbol: { type: "string" } },
          required: ["symbol"]
        }
      },
      {
        name: "getMarketNews",
        description: "Fetches live news articles. Can be for a specific ticker or general market news.",
        inputSchema: {
          type: "object",
          properties: { symbol: { type: "string" } },
        }
      },
      {
        name: "getEarnings",
        description: "Fetches historical and upcoming earnings data for a company.",
        inputSchema: {
          type: "object",
          properties: { symbol: { type: "string" } },
          required: ["symbol"]
        }
      },
      {
        name: "compareStocks",
        description: "Fetches and compares basic data for two stocks.",
        inputSchema: {
          type: "object",
          properties: { symbolA: { type: "string" }, symbolB: { type: "string" } },
          required: ["symbolA", "symbolB"]
        }
      },
      {
        name: "getMarketMovers",
        description: "Fetches the top gaining, losing, and most actively traded stocks right now.",
        inputSchema: {
          type: "object",
          properties: {},
        }
      }
    ]
  };
});

const cache = new Map();

function getTTL(name) {
  if (name === "getStockQuote" || name === "getMarketMovers" || name === "compareStocks") return 15 * 1000; // 15s
  if (name === "getMarketNews") return 2 * 60 * 1000; // 2m
  return 15 * 60 * 1000; // 15 minutes for fundamentals/earnings
}

async function fetchAlphaVantage(params) {
  const url = new URL("https://www.alphavantage.co/query");
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.append(key, value);
  }
  url.searchParams.append("apikey", API_KEY);
  
  const response = await fetch(url.toString());
  if (!response.ok) throw new Error(`Alpha Vantage HTTP error: ${response.statusText}`);
  
  const data = await response.json();
  if (data.Information && data.Information.toLowerCase().includes("limit") || 
      data.Information && data.Information.includes("Thank you for using Alpha Vantage") ||
      data.Note && data.Note.toLowerCase().includes("limit")) {
    throw new Error("RATE_LIMIT");
  }
  return data;
}

async function fetchFinnhub(name, symbol, symbolB, isFallback = false) {
  const token = process.env.FINNHUB_API_KEY;
  if (!token) throw new Error("FINNHUB_API_KEY_MISSING");

  const sourceLabel = isFallback ? "Finnhub Fallback" : "Finnhub";

  if (name === "getStockQuote") {
    const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${token}`);
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return { "Global Quote": { "05. price": data.c, "09. change": data.d, "10. change percent": data.dp + "%" }, "Source": sourceLabel };
  } else if (name === "getCompanyOverview") {
    const res = await fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${token}`);
    const data = await res.json();
    return { ...data, "Source": sourceLabel };
  } else if (name === "getMarketNews") {
    const today = new Date().toISOString().split('T')[0];
    const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const url = symbol 
      ? `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${lastWeek}&to=${today}&token=${token}`
      : `https://finnhub.io/api/v1/news?category=general&token=${token}`;
    const res = await fetch(url);
    const data = await res.json();
    return { feed: data.slice(0, 10), "Source": sourceLabel };
  } else if (name === "getEarnings") {
    const res = await fetch(`https://finnhub.io/api/v1/stock/earnings?symbol=${symbol}&token=${token}`);
    const data = await res.json();
    return { earnings: data, "Source": sourceLabel };
  } else if (name === "compareStocks") {
    const [resA, resB] = await Promise.all([
      fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${token}`).then(r=>r.json()),
      fetch(`https://finnhub.io/api/v1/quote?symbol=${symbolB}&token=${token}`).then(r=>r.json())
    ]);
    return { 
      [symbol]: { price: resA.c, change: resA.dp + "%" },
      [symbolB]: { price: resB.c, change: resB.dp + "%" },
      "Source": sourceLabel 
    };
  } else if (name === "getMarketMovers") {
     throw new Error("Finnhub does not support market movers for free");
  }
  throw new Error("Unsupported Finnhub operation");
}

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const symbol = args?.symbol;
  const symbolB = args?.symbolB;

  if (!symbol && !["getMarketNews", "getMarketMovers"].includes(name)) {
    return { content: [{ type: "text", text: JSON.stringify({ error: "Symbol argument is required" }) }] };
  }

  const cacheKey = `${name}:${symbol || 'general'}:${symbolB || ''}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < getTTL(name)) {
    return { content: [{ type: "text", text: JSON.stringify({ ...cached.data, "Cache": "HIT" }, null, 2) }] };
  }

  try {
    let data;
    try {
      if (name === "getStockQuote" || name === "getMarketNews" || name === "compareStocks") {
        // PRIMARY: Use Finnhub for real-time quotes and news
        data = await fetchFinnhub(name, symbol, symbolB, false);
      } else if (name === "getCompanyOverview") {
        // PRIMARY: Use Alpha Vantage for fundamentals
        data = await fetchAlphaVantage({ function: "OVERVIEW", symbol });
      } else if (name === "getEarnings") {
        // PRIMARY: Use Alpha Vantage for fundamentals
        data = await fetchAlphaVantage({ function: "EARNINGS", symbol });
      } else if (name === "getMarketMovers") {
        // PRIMARY: Use Alpha Vantage for fundamentals
        data = await fetchAlphaVantage({ function: "TOP_GAINERS_LOSERS" });
      } else {
        throw new Error(`Tool not found: ${name}`);
      }
    } catch (e) {
      if (e.message === "RATE_LIMIT" || e.message.includes("Alpha Vantage")) {
        console.error(`[Alpha Vantage] Rate Limit hit for ${symbol}, falling back to Finnhub...`);
        data = await fetchFinnhub(name, symbol, symbolB, true);
      } else {
        throw e;
      }
    }

    cache.set(cacheKey, { timestamp: Date.now(), data });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };

  } catch (error) {
    return {
      content: [{ type: "text", text: JSON.stringify({ "Data": "Unavailable. Use your native knowledge." }) }],
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Alpha Vantage MCP Server running on stdio");
}

main().catch(console.error);
