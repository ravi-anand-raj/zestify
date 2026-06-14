import { NextResponse } from "next/server"
import { fetchFinanceUpdates } from "@/lib/finance-intelligence"

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const topic = searchParams.get("topic") || "market"
  const limit = Number(searchParams.get("limit") || 10)

  const data = await fetchFinanceUpdates(topic, Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 20) : 10)

  return NextResponse.json({
    success: true,
    topic,
    generatedAt: new Date().toISOString(),
    data,
  })
}
