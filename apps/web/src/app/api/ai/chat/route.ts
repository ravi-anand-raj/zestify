import { createGroq } from "@ai-sdk/groq"
import { streamText, tool } from "ai"
import { z } from "zod"
import { getMcpTools } from "@/lib/mcp-client"
import { hasUsableGroqKey } from "@/lib/finance-intelligence"

export const dynamic = "force-dynamic"
export const maxDuration = 30

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY || "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"
})

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    if (!hasUsableGroqKey()) {
      return Response.json({ error: "Groq API key missing" }, { status: 400 })
    }

    const mcpTools = await getMcpTools();

    // Dynamically build the tool map to bridge Vercel AI SDK to MCP
    const tools = {
      getStockQuote: {
        description: "Fetches the absolute latest price, volume, and daily change for a specific stock ticker.",
        parameters: z.object({ symbol: z.string() }),
        execute: async ({ symbol }: { symbol: string }) => {
          const res = await mcpTools.getStockQuote?.execute({ symbol });
          return res;
        }
      },
      getCompanyOverview: {
        description: "Fetches fundamental data for a company, including P/E ratio, Market Cap, 52-week highs/lows.",
        parameters: z.object({ symbol: z.string() }),
        execute: async ({ symbol }: { symbol: string }) => mcpTools.getCompanyOverview?.execute({ symbol })
      },
      getMarketNews: {
        description: "Fetches live news articles and their AI-calculated sentiment scores.",
        parameters: z.object({ symbol: z.string().optional() }),
        execute: async ({ symbol }: { symbol?: string }) => mcpTools.getMarketNews?.execute({ symbol })
      },
      getEarnings: {
        description: "Fetches historical and upcoming earnings data for a company.",
        parameters: z.object({ symbol: z.string() }),
        execute: async ({ symbol }: { symbol: string }) => mcpTools.getEarnings?.execute({ symbol })
      },
      compareStocks: {
        description: "Fetches and compares basic data for two stocks.",
        parameters: z.object({ symbolA: z.string(), symbolB: z.string() }),
        execute: async ({ symbolA, symbolB }: { symbolA: string, symbolB: string }) => mcpTools.compareStocks?.execute({ symbolA, symbolB })
      },
      getMarketMovers: {
        description: "Fetches the top gaining, losing, and most actively traded stocks right now.",
        parameters: z.object({}),
        execute: async () => mcpTools.getMarketMovers?.execute({})
      }
    };

    const result = streamText({
      model: groq("llama-3.3-70b-versatile"),
      messages,
      tools: tools as any,
      system: `You are ZUST AI, a Senior AI Engineer and Institutional-Grade Financial Intelligence Copilot.
Your mission is to provide accurate, objective, beginner-friendly fundamental analysis.

CRITICAL DIRECTIVES:
1. NEVER generate stock prices, financial ratios, earnings, or news from model memory. ALWAYS use the provided tools to fetch live data from Alpha Vantage or Finnhub.
2. If the data provider returns an error, "RATE_LIMIT", or "Unavailable", NEVER mention "API limit", "Alpha Vantage", or "tool error" to the user.
3. If real-time data fails entirely, you MUST gracefully fallback by stating: "Live data provider temporarily unavailable. Fetching data from backup source." and proceed to provide generic fundamental analysis.
4. Format your analysis beautifully using markdown (bolding, bullet points).
5. Always include a disclaimer at the end stating this is educational statistical intelligence, not financial advice.`
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("AI route error:", error)
    return Response.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
