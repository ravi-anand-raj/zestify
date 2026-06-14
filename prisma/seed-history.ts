import { PrismaClient } from '@prisma/client';
import yahooFinance from 'yahoo-finance2';

const prisma = new PrismaClient();

async function seedHistory() {
  console.log('🌱 Starting historical data seed...');

  // The symbols to fetch 20 years of history for
  const symbols = [
    { symbol: 'AAPL', type: 'STOCK', exchange: 'NASDAQ', name: 'Apple Inc.' },
    { symbol: 'MSFT', type: 'STOCK', exchange: 'NASDAQ', name: 'Microsoft Corp.' },
    { symbol: 'SPY', type: 'ETF', exchange: 'NYSE', name: 'SPDR S&P 500 ETF Trust' },
    { symbol: 'TSLA', type: 'STOCK', exchange: 'NASDAQ', name: 'Tesla Inc.' },
    { symbol: 'BTC-USD', type: 'CRYPTO', exchange: 'CRYPTO', name: 'Bitcoin' },
    { symbol: 'ETH-USD', type: 'CRYPTO', exchange: 'CRYPTO', name: 'Ethereum' },
  ];

  // Get or create an Equity asset class
  const equityClass = await prisma.assetClass.findFirst({ where: { slug: 'equity' } });
  if (!equityClass) throw new Error('Equity AssetClass not found. Please run regular seed first.');

  // Get or create a Crypto asset class
  let cryptoClass = await prisma.assetClass.findFirst({ where: { slug: 'crypto' } });
  if (!cryptoClass) {
    cryptoClass = await prisma.assetClass.create({
      data: {
        name: 'Cryptocurrency',
        slug: 'crypto',
        description: 'Digital assets',
        riskLevel: 5,
      }
    });
  }

  for (const item of symbols) {
    console.log(`\nFetching asset: ${item.symbol}...`);
    
    // 1. Get or create Asset
    const assetClassId = item.type === 'CRYPTO' ? cryptoClass.id : equityClass.id;
    const asset = await prisma.asset.upsert({
      where: {
        uq_asset_symbol_exchange: {
          symbol: item.symbol,
          exchange: item.exchange,
        }
      },
      update: {},
      create: {
        name: item.name,
        symbol: item.symbol,
        exchange: item.exchange,
        type: item.type as any,
        assetClassId: assetClassId,
        currency: 'USD',
      }
    });

    console.log(`Asset ${item.symbol} ready (ID: ${asset.id}). Fetching history...`);

    // 2. Fetch 20 years of historical data from Yahoo Finance (monthly to be efficient)
    try {
      const queryOptions = {
        period1: '2004-01-01',
        interval: '1mo' as const,
      };
      const historicalData = await yahooFinance.historical(item.symbol, queryOptions);
      
      console.log(`Got ${historicalData.length} records for ${item.symbol}.`);

      // 3. Clear old history for this asset to avoid duplicates or errors
      await prisma.assetPriceHistory.deleteMany({
        where: { assetId: asset.id }
      });

      // 4. Bulk insert the history
      const batch = historicalData.map(data => ({
        assetId: asset.id,
        date: data.date,
        open: data.open || 0,
        high: data.high || 0,
        low: data.low || 0,
        close: data.close || 0,
        volume: data.volume || 0,
      }));

      await prisma.assetPriceHistory.createMany({
        data: batch,
        skipDuplicates: true,
      });

      console.log(`✅ Seeded history for ${item.symbol}`);
    } catch (error) {
      console.error(`❌ Failed to fetch/seed history for ${item.symbol}:`, error);
    }
  }

  console.log('\n🎉 Finished seeding historical data!');
}

seedHistory()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
