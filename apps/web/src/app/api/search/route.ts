import { NextResponse } from 'next/server';
import YahooFinanceModule from 'yahoo-finance2';

// yahoo-finance2 v3 requires instantiation
let yahooFinance: any;
try {
  if (typeof YahooFinanceModule === 'function') {
    yahooFinance = new (YahooFinanceModule as any)();
  } else if ((YahooFinanceModule as any).default) {
    const Mod = (YahooFinanceModule as any).default;
    yahooFinance = typeof Mod === 'function' ? new Mod() : Mod;
  } else {
    yahooFinance = YahooFinanceModule;
  }
} catch {
  yahooFinance = (YahooFinanceModule as any).default || YahooFinanceModule;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');

  if (!q || q.length < 1) {
    return NextResponse.json({ success: true, data: [] });
  }

  try {
    const results = await yahooFinance.search(q, { newsCount: 0 });
    
    // Format the top 5 results for the command menu
    const formattedResults = results.quotes.slice(0, 5).map((quote: any) => ({
      symbol: quote.symbol,
      shortname: quote.shortname || quote.longname || quote.symbol,
      exchDisp: quote.exchDisp,
      typeDisp: quote.typeDisp,
      score: quote.score,
    }));

    return NextResponse.json({ success: true, data: formattedResults });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ success: false, error: 'Failed to search' }, { status: 500 });
  }
}
