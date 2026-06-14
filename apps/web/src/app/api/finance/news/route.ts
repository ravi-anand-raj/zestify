import { NextResponse } from "next/server"
import { fetchFinanceUpdates } from "@/lib/finance-intelligence"

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get("category") || "all"
  const limit = Number(searchParams.get("limit") || 8)
  const safeLimit = Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 20) : 8

  try {
    if (category === "all") {
      // Fetch from different categories sequentially to avoid rate limiting
      const categories = ["market", "business", "technology", "economy"]
      const allItems: any[] = []
      
      for (const cat of categories) {
        try {
          const items = await fetchFinanceUpdates(cat, Math.ceil(safeLimit / 2))
          allItems.push(...items)
        } catch (e) {
          console.error(`News fetch failed for category ${cat}:`, e)
        }
      }

      // Deduplicate by title
      const seen = new Set<string>()
      const deduplicated = allItems.filter(item => {
        const key = item.title.toLowerCase().trim()
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })

      // Sort by publish time
      deduplicated.sort((a, b) => {
        if (!a.publishedAt || !b.publishedAt) return 0
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      })

      return NextResponse.json({
        success: true,
        category: "all",
        generatedAt: new Date().toISOString(),
        data: deduplicated.slice(0, safeLimit * 2),
      })
    }

    // Single category fetch
    const data = await fetchFinanceUpdates(category, safeLimit)

    return NextResponse.json({
      success: true,
      category,
      generatedAt: new Date().toISOString(),
      data,
    })
  } catch (error) {
    console.error("News API error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch news", data: [] },
      { status: 500 }
    )
  }
}
