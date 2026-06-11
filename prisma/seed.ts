/**
 * ============================================================================
 * ZESTIFY — Prisma Database Seed
 * ============================================================================
 *
 * Seeds the database with essential reference data required for the platform
 * to function. This file is idempotent — running it multiple times will not
 * create duplicate records thanks to upsert operations.
 *
 * Seeded entities:
 *   1. Asset Classes    (8 records)  — system taxonomy for investment types
 *   2. Plans            (3 records)  — subscription tiers (Free / Pro / Elite)
 *   3. System Settings  (8 records)  — runtime configuration key-value pairs
 *   4. Feature Flags    (6 records)  — gradual feature rollout controls
 *   5. Demo Assets      (15 records) — popular Indian stocks, MFs, ETFs, etc.
 *
 * Usage:
 *   npx prisma db seed
 *   # or
 *   npx ts-node prisma/seed.ts
 *
 * ============================================================================
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Simple logger with a category prefix. */
function log(category: string, message: string): void {
  console.log(`  [${category}] ${message}`);
}

// ---------------------------------------------------------------------------
// 1. Asset Classes
// ---------------------------------------------------------------------------

async function seedAssetClasses() {
  console.log('\n🏷️  Seeding Asset Classes …');

  const assetClassesData = [
    {
      name: 'Equity',
      slug: 'equity',
      description: 'Stocks, ETFs, and equity mutual funds',
      iconName: 'trending-up',
      color: '#4F46E5',
      riskLevel: 4,
      sortOrder: 1,
    },
    {
      name: 'Debt',
      slug: 'debt',
      description: 'Bonds, fixed deposits, and debt mutual funds',
      iconName: 'shield',
      color: '#0EA5E9',
      riskLevel: 2,
      sortOrder: 2,
    },
    {
      name: 'Gold',
      slug: 'gold',
      description: 'Physical gold, sovereign gold bonds, and gold ETFs',
      iconName: 'coins',
      color: '#F59E0B',
      riskLevel: 3,
      sortOrder: 3,
    },
    {
      name: 'Real Estate',
      slug: 'real-estate',
      description: 'Property investments and REITs',
      iconName: 'building',
      color: '#10B981',
      riskLevel: 3,
      sortOrder: 4,
    },
    {
      name: 'Cash & Equivalents',
      slug: 'cash',
      description: 'Savings accounts, liquid funds, and money market',
      iconName: 'wallet',
      color: '#6B7280',
      riskLevel: 1,
      sortOrder: 5,
    },
    {
      name: 'Cryptocurrency',
      slug: 'crypto',
      description: 'Bitcoin, Ethereum, and other digital currencies',
      iconName: 'bitcoin',
      color: '#F97316',
      riskLevel: 5,
      sortOrder: 6,
    },
    {
      name: 'Government Securities',
      slug: 'government',
      description: 'PPF, NPS, EPF, and government bonds',
      iconName: 'landmark',
      color: '#8B5CF6',
      riskLevel: 1,
      sortOrder: 7,
    },
    {
      name: 'Alternative',
      slug: 'alternative',
      description: 'Commodities, art, and other alternative investments',
      iconName: 'gem',
      color: '#EC4899',
      riskLevel: 4,
      sortOrder: 8,
    },
  ] as const;

  const results: Record<string, { id: string }> = {};

  for (const ac of assetClassesData) {
    const record = await prisma.assetClass.upsert({
      where: { slug: ac.slug },
      update: {
        name: ac.name,
        description: ac.description,
        iconName: ac.iconName,
        color: ac.color,
        riskLevel: ac.riskLevel,
        sortOrder: ac.sortOrder,
      },
      create: ac,
    });
    results[ac.slug] = record;
    log('AssetClass', `✔ ${ac.name} (${record.id})`);
  }

  console.log(`  → ${assetClassesData.length} asset classes seeded.`);
  return results;
}

// ---------------------------------------------------------------------------
// 2. Plans
// ---------------------------------------------------------------------------

async function seedPlans() {
  console.log('\n💳  Seeding Plans …');

  const plansData = [
    {
      name: 'Free',
      slug: 'free',
      description: 'Get started with basic portfolio tracking',
      monthlyPrice: 0,
      yearlyPrice: 0,
      currency: 'INR',
      features: [
        '1 Portfolio',
        'Up to 25 Holdings',
        'Basic Analytics',
        'Manual Transaction Entry',
        '3 Goals',
        'Community Support',
      ],
      limits: {
        maxPortfolios: 1,
        maxHoldings: 25,
        maxGoals: 3,
        maxWatchlists: 1,
        maxWatchlistItems: 10,
        aiTokensPerMonth: 1000,
        reportsPerMonth: 1,
      },
      trialDays: 0,
      isActive: true,
      isPopular: false,
      sortOrder: 1,
    },
    {
      name: 'Pro',
      slug: 'pro',
      description: 'Advanced tools for serious investors',
      monthlyPrice: 299,
      yearlyPrice: 2499,
      currency: 'INR',
      features: [
        '5 Portfolios',
        'Unlimited Holdings',
        'Advanced Analytics & Charts',
        'AI Copilot (500 queries/mo)',
        'Unlimited Goals',
        'Receipt OCR',
        'Priority Email Support',
        'CSV/PDF Exports',
        'Price Alerts',
        'Tax Report (Basic)',
      ],
      limits: {
        maxPortfolios: 5,
        maxHoldings: -1,
        maxGoals: -1,
        maxWatchlists: 5,
        maxWatchlistItems: 50,
        aiTokensPerMonth: 50000,
        reportsPerMonth: 10,
      },
      trialDays: 14,
      isActive: true,
      isPopular: true,
      sortOrder: 2,
    },
    {
      name: 'Elite',
      slug: 'elite',
      description: 'Complete financial operating system for power users',
      monthlyPrice: 799,
      yearlyPrice: 6999,
      currency: 'INR',
      features: [
        'Unlimited Portfolios',
        'Unlimited Holdings',
        'AI Copilot (Unlimited)',
        'Advanced Tax Reports',
        'Capital Gains Report',
        'Portfolio Rebalancing Alerts',
        'API Access',
        'Family Portfolio Sharing',
        'Dedicated Support',
        'Custom Reports',
        'Anomaly Detection',
        'Cash Flow Forecasting',
      ],
      limits: {
        maxPortfolios: -1,
        maxHoldings: -1,
        maxGoals: -1,
        maxWatchlists: -1,
        maxWatchlistItems: -1,
        aiTokensPerMonth: -1,
        reportsPerMonth: -1,
      },
      trialDays: 14,
      isActive: true,
      isPopular: false,
      sortOrder: 3,
    },
  ];

  for (const plan of plansData) {
    const record = await prisma.plan.upsert({
      where: { slug: plan.slug },
      update: {
        name: plan.name,
        description: plan.description,
        monthlyPrice: plan.monthlyPrice,
        yearlyPrice: plan.yearlyPrice,
        currency: plan.currency,
        features: plan.features,
        limits: plan.limits,
        trialDays: plan.trialDays,
        isActive: plan.isActive,
        isPopular: plan.isPopular,
        sortOrder: plan.sortOrder,
      },
      create: plan,
    });
    log('Plan', `✔ ${plan.name} — ₹${plan.monthlyPrice}/mo, ₹${plan.yearlyPrice}/yr (${record.id})`);
  }

  console.log(`  → ${plansData.length} plans seeded.`);
}

// ---------------------------------------------------------------------------
// 3. System Settings
// ---------------------------------------------------------------------------

async function seedSystemSettings() {
  console.log('\n⚙️  Seeding System Settings …');

  const settingsData = [
    {
      key: 'app.maintenance_mode',
      value: false,
      description: 'Enable maintenance mode for the entire platform',
      isPublic: true,
    },
    {
      key: 'app.registration_enabled',
      value: true,
      description: 'Allow new user registrations',
      isPublic: true,
    },
    {
      key: 'app.default_currency',
      value: 'INR',
      description: 'Default currency for new users',
      isPublic: true,
    },
    {
      key: 'app.default_timezone',
      value: 'Asia/Kolkata',
      description: 'Default timezone for new users',
      isPublic: true,
    },
    {
      key: 'ai.default_model',
      value: 'gpt-4o',
      description: 'Default AI model for copilot',
      isPublic: false,
    },
    {
      key: 'ai.categorization_model',
      value: 'gpt-4o-mini',
      description: 'Model used for transaction categorization',
      isPublic: false,
    },
    {
      key: 'ai.max_tokens_per_request',
      value: 4096,
      description: 'Maximum tokens per AI request',
      isPublic: false,
    },
    {
      key: 'notifications.digest_hour',
      value: 9,
      description: 'Hour of day (IST) to send daily digest emails',
      isPublic: false,
    },
  ];

  for (const setting of settingsData) {
    const record = await prisma.systemSetting.upsert({
      where: { key: setting.key },
      update: {
        value: setting.value,
        description: setting.description,
        isPublic: setting.isPublic,
      },
      create: setting,
    });
    log('Setting', `✔ ${setting.key} = ${JSON.stringify(setting.value)} (${record.id})`);
  }

  console.log(`  → ${settingsData.length} system settings seeded.`);
}

// ---------------------------------------------------------------------------
// 4. Feature Flags
// ---------------------------------------------------------------------------

async function seedFeatureFlags() {
  console.log('\n🚩  Seeding Feature Flags …');

  const flagsData = [
    {
      key: 'ai_copilot',
      description: 'Enable AI Copilot chat feature',
      isEnabled: true,
      rolloutPercentage: 100,
    },
    {
      key: 'receipt_ocr',
      description: 'Enable receipt scanning and OCR',
      isEnabled: true,
      rolloutPercentage: 100,
    },
    {
      key: 'crypto_tracking',
      description: 'Enable cryptocurrency asset tracking',
      isEnabled: false,
      rolloutPercentage: 0,
    },
    {
      key: 'bank_sync',
      description: 'Enable automatic bank account syncing',
      isEnabled: false,
      rolloutPercentage: 0,
    },
    {
      key: 'family_sharing',
      description: 'Enable family portfolio sharing feature',
      isEnabled: false,
      rolloutPercentage: 0,
    },
    {
      key: 'advanced_tax_reports',
      description: 'Enable advanced tax computation reports',
      isEnabled: true,
      rolloutPercentage: 50,
    },
  ];

  for (const flag of flagsData) {
    const record = await prisma.featureFlag.upsert({
      where: { key: flag.key },
      update: {
        description: flag.description,
        isEnabled: flag.isEnabled,
        rolloutPercentage: flag.rolloutPercentage,
      },
      create: flag,
    });
    log(
      'Flag',
      `✔ ${flag.key} — ${flag.isEnabled ? 'ON' : 'OFF'} @ ${flag.rolloutPercentage}% (${record.id})`,
    );
  }

  console.log(`  → ${flagsData.length} feature flags seeded.`);
}

// ---------------------------------------------------------------------------
// 5. Demo Assets
// ---------------------------------------------------------------------------

async function seedDemoAssets(assetClasses: Record<string, { id: string }>) {
  console.log('\n📈  Seeding Demo Assets …');

  const equityId = assetClasses['equity'].id;
  const debtId = assetClasses['debt'].id;
  const goldId = assetClasses['gold'].id;
  const governmentId = assetClasses['government'].id;

  // --- Stocks (Equity, NSE-listed) -----------------------------------------

  const stocks = [
    {
      name: 'Reliance Industries Limited',
      symbol: 'RELIANCE',
      exchange: 'NSE',
      assetType: 'STOCK',
      assetClassId: equityId,
      currency: 'INR',
      currentPrice: 2935.45,
      isin: 'INE002A01018',
      sector: 'Energy',
      metadata: {
        lotSize: 1,
        marketCap: 'Large Cap',
        industry: 'Oil & Gas — Refining & Marketing',
        website: 'https://www.ril.com',
      },
      isActive: true,
    },
    {
      name: 'Tata Consultancy Services Limited',
      symbol: 'TCS',
      exchange: 'NSE',
      assetType: 'STOCK',
      assetClassId: equityId,
      currency: 'INR',
      currentPrice: 4122.30,
      isin: 'INE467B01029',
      sector: 'Information Technology',
      metadata: {
        lotSize: 1,
        marketCap: 'Large Cap',
        industry: 'IT Services & Consulting',
        website: 'https://www.tcs.com',
      },
      isActive: true,
    },
    {
      name: 'HDFC Bank Limited',
      symbol: 'HDFCBANK',
      exchange: 'NSE',
      assetType: 'STOCK',
      assetClassId: equityId,
      currency: 'INR',
      currentPrice: 1812.75,
      isin: 'INE040A01034',
      sector: 'Financials',
      metadata: {
        lotSize: 1,
        marketCap: 'Large Cap',
        industry: 'Private Sector Bank',
        website: 'https://www.hdfcbank.com',
      },
      isActive: true,
    },
    {
      name: 'Infosys Limited',
      symbol: 'INFY',
      exchange: 'NSE',
      assetType: 'STOCK',
      assetClassId: equityId,
      currency: 'INR',
      currentPrice: 1654.20,
      isin: 'INE009A01021',
      sector: 'Information Technology',
      metadata: {
        lotSize: 1,
        marketCap: 'Large Cap',
        industry: 'IT Services & Consulting',
        website: 'https://www.infosys.com',
      },
      isActive: true,
    },
    {
      name: 'ITC Limited',
      symbol: 'ITC',
      exchange: 'NSE',
      assetType: 'STOCK',
      assetClassId: equityId,
      currency: 'INR',
      currentPrice: 468.55,
      isin: 'INE154A01025',
      sector: 'Consumer Staples',
      metadata: {
        lotSize: 1,
        marketCap: 'Large Cap',
        industry: 'FMCG — Tobacco & Consumer Goods',
        website: 'https://www.itcportal.com',
      },
      isActive: true,
    },
  ];

  for (const stock of stocks) {
    const record = await prisma.asset.upsert({
      where: {
        uq_asset_symbol_exchange: {
          symbol: stock.symbol,
          exchange: stock.exchange,
        },
      },
      update: {
        name: stock.name,
        assetType: stock.assetType,
        assetClassId: stock.assetClassId,
        currency: stock.currency,
        currentPrice: stock.currentPrice,
        isin: stock.isin,
        sector: stock.sector,
        metadata: stock.metadata,
        isActive: stock.isActive,
      },
      create: stock,
    });
    log('Stock', `✔ ${stock.symbol} — ₹${stock.currentPrice} (${record.id})`);
  }

  // --- Mutual Funds (Equity class, NAV-style) ------------------------------

  const mutualFunds = [
    {
      name: 'UTI Nifty 50 Index Fund — Direct Growth',
      symbol: 'UTI-NIFTY50-DG',
      exchange: 'AMFI',
      assetType: 'MUTUAL_FUND',
      assetClassId: equityId,
      currency: 'INR',
      currentPrice: 168.42,
      isin: 'INF789F01UZ2',
      sector: 'Index Fund',
      metadata: {
        fundHouse: 'UTI Asset Management',
        category: 'Equity — Large Cap',
        planType: 'Direct',
        growthOrDividend: 'Growth',
        aum: '₹18,500 Cr',
        expenseRatio: 0.18,
        benchmark: 'Nifty 50 TRI',
      },
      isActive: true,
    },
    {
      name: 'HDFC Flexi Cap Fund — Direct Growth',
      symbol: 'HDFC-FLEXICAP-DG',
      exchange: 'AMFI',
      assetType: 'MUTUAL_FUND',
      assetClassId: equityId,
      currency: 'INR',
      currentPrice: 1842.67,
      isin: 'INF179K01BE2',
      sector: 'Flexi Cap',
      metadata: {
        fundHouse: 'HDFC Asset Management',
        category: 'Equity — Flexi Cap',
        planType: 'Direct',
        growthOrDividend: 'Growth',
        aum: '₹62,300 Cr',
        expenseRatio: 0.77,
        benchmark: 'NIFTY 500 TRI',
      },
      isActive: true,
    },
  ];

  for (const mf of mutualFunds) {
    const record = await prisma.asset.upsert({
      where: {
        uq_asset_symbol_exchange: {
          symbol: mf.symbol,
          exchange: mf.exchange,
        },
      },
      update: {
        name: mf.name,
        assetType: mf.assetType,
        assetClassId: mf.assetClassId,
        currency: mf.currency,
        currentPrice: mf.currentPrice,
        isin: mf.isin,
        sector: mf.sector,
        metadata: mf.metadata,
        isActive: mf.isActive,
      },
      create: mf,
    });
    log('MF', `✔ ${mf.symbol} — NAV ₹${mf.currentPrice} (${record.id})`);
  }

  // --- ETFs (Equity / Gold class) ------------------------------------------

  const etfs = [
    {
      name: 'Nippon India ETF Nifty BeES',
      symbol: 'NIFTYBEES',
      exchange: 'NSE',
      assetType: 'ETF',
      assetClassId: equityId,
      currency: 'INR',
      currentPrice: 268.90,
      isin: 'INF204KB14I2',
      sector: 'Index ETF',
      metadata: {
        fundHouse: 'Nippon India Mutual Fund',
        benchmark: 'Nifty 50',
        expenseRatio: 0.04,
        trackingError: 0.03,
      },
      isActive: true,
    },
    {
      name: 'Nippon India ETF Gold BeES',
      symbol: 'GOLDBEES',
      exchange: 'NSE',
      assetType: 'ETF',
      assetClassId: goldId,
      currency: 'INR',
      currentPrice: 62.18,
      isin: 'INF204KB17I5',
      sector: 'Gold ETF',
      metadata: {
        fundHouse: 'Nippon India Mutual Fund',
        benchmark: 'Domestic Gold Prices',
        expenseRatio: 0.79,
      },
      isActive: true,
    },
  ];

  for (const etf of etfs) {
    const record = await prisma.asset.upsert({
      where: {
        uq_asset_symbol_exchange: {
          symbol: etf.symbol,
          exchange: etf.exchange,
        },
      },
      update: {
        name: etf.name,
        assetType: etf.assetType,
        assetClassId: etf.assetClassId,
        currency: etf.currency,
        currentPrice: etf.currentPrice,
        isin: etf.isin,
        sector: etf.sector,
        metadata: etf.metadata,
        isActive: etf.isActive,
      },
      create: etf,
    });
    log('ETF', `✔ ${etf.symbol} — ₹${etf.currentPrice} (${record.id})`);
  }

  // --- Government Securities -----------------------------------------------
  // PPF and NPS don't have a symbol/exchange pair on any stock exchange.
  // We use a synthetic symbol + exchange = 'GOV' and the compound unique.

  const govAssets = [
    {
      name: 'Public Provident Fund (PPF)',
      symbol: 'PPF',
      exchange: 'GOV',
      assetType: 'GOVERNMENT',
      assetClassId: governmentId,
      currency: 'INR',
      currentPrice: 0, // PPF has no market price; value is account balance
      sector: 'Small Savings',
      metadata: {
        interestRate: 7.1,
        lockInYears: 15,
        taxBenefit: '80C',
        maxAnnualDeposit: 150000,
        compounding: 'Annual',
        guaranteedBy: 'Government of India',
      },
      isActive: true,
    },
    {
      name: 'National Pension System — Tier 1',
      symbol: 'NPS-T1',
      exchange: 'GOV',
      assetType: 'GOVERNMENT',
      assetClassId: governmentId,
      currency: 'INR',
      currentPrice: 0,
      sector: 'Pension',
      metadata: {
        taxBenefit: '80CCD(1B)',
        additionalDeduction: 50000,
        lockInAge: 60,
        regulator: 'PFRDA',
        schemes: ['E — Equity', 'C — Corporate Bonds', 'G — Government Securities', 'A — Alternative'],
      },
      isActive: true,
    },
  ];

  for (const gov of govAssets) {
    const record = await prisma.asset.upsert({
      where: {
        uq_asset_symbol_exchange: {
          symbol: gov.symbol,
          exchange: gov.exchange,
        },
      },
      update: {
        name: gov.name,
        assetType: gov.assetType,
        assetClassId: gov.assetClassId,
        currency: gov.currency,
        currentPrice: gov.currentPrice,
        sector: gov.sector,
        metadata: gov.metadata,
        isActive: gov.isActive,
      },
      create: gov,
    });
    log('Gov', `✔ ${gov.symbol} (${record.id})`);
  }

  // --- Debt Instruments ----------------------------------------------------

  const debtAssets = [
    {
      name: 'SBI Fixed Deposit — 1 Year',
      symbol: 'SBI-FD-1Y',
      exchange: 'BANK',
      assetType: 'FIXED_DEPOSIT',
      assetClassId: debtId,
      currency: 'INR',
      currentPrice: 0,
      sector: 'Fixed Deposit',
      metadata: {
        bank: 'State Bank of India',
        interestRate: 6.8,
        tenureMonths: 12,
        compounding: 'Quarterly',
        prematureWithdrawalPenalty: '1%',
        depositInsurance: 'DICGC up to ₹5,00,000',
      },
      isActive: true,
    },
    {
      name: 'HDFC Short Term Debt Fund — Direct Growth',
      symbol: 'HDFC-STDF-DG',
      exchange: 'AMFI',
      assetType: 'MUTUAL_FUND',
      assetClassId: debtId,
      currency: 'INR',
      currentPrice: 29.84,
      isin: 'INF179K01GS4',
      sector: 'Debt Fund',
      metadata: {
        fundHouse: 'HDFC Asset Management',
        category: 'Debt — Short Duration',
        planType: 'Direct',
        growthOrDividend: 'Growth',
        aum: '₹13,200 Cr',
        expenseRatio: 0.35,
        avgMaturity: '2.8 years',
        yieldToMaturity: 7.6,
      },
      isActive: true,
    },
  ];

  for (const debt of debtAssets) {
    const record = await prisma.asset.upsert({
      where: {
        uq_asset_symbol_exchange: {
          symbol: debt.symbol,
          exchange: debt.exchange,
        },
      },
      update: {
        name: debt.name,
        assetType: debt.assetType,
        assetClassId: debt.assetClassId,
        currency: debt.currency,
        currentPrice: debt.currentPrice,
        sector: debt.sector,
        metadata: debt.metadata,
        isActive: debt.isActive,
      },
      create: debt,
    });
    log('Debt', `✔ ${debt.symbol} (${record.id})`);
  }

  // --- Gold ----------------------------------------------------------------

  const goldAssets = [
    {
      name: 'Sovereign Gold Bond 2024-25 Series I',
      symbol: 'SGB-2024-25-I',
      exchange: 'RBI',
      assetType: 'GOLD_BOND',
      assetClassId: goldId,
      currency: 'INR',
      currentPrice: 7150.0,
      sector: 'Sovereign Bond',
      metadata: {
        issuer: 'Reserve Bank of India',
        tenureYears: 8,
        interestRate: 2.5,
        interestPayout: 'Semi-annual',
        taxBenefit: 'LTCG exempt on maturity',
        minInvestment: '1 gram',
        maxInvestment: '4 kg (individual)',
        underlyingGoldPurity: '999',
      },
      isActive: true,
    },
  ];

  for (const gold of goldAssets) {
    const record = await prisma.asset.upsert({
      where: {
        uq_asset_symbol_exchange: {
          symbol: gold.symbol,
          exchange: gold.exchange,
        },
      },
      update: {
        name: gold.name,
        assetType: gold.assetType,
        assetClassId: gold.assetClassId,
        currency: gold.currency,
        currentPrice: gold.currentPrice,
        sector: gold.sector,
        metadata: gold.metadata,
        isActive: gold.isActive,
      },
      create: gold,
    });
    log('Gold', `✔ ${gold.symbol} — ₹${gold.currentPrice}/gm (${record.id})`);
  }

  const totalAssets =
    stocks.length +
    mutualFunds.length +
    etfs.length +
    govAssets.length +
    debtAssets.length +
    goldAssets.length;

  console.log(`  → ${totalAssets} demo assets seeded.`);
}

// ---------------------------------------------------------------------------
// Main Seed Function
// ---------------------------------------------------------------------------

async function main() {
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║         🍋  ZESTIFY — Database Seed  🍋         ║');
  console.log('╚══════════════════════════════════════════════════╝');

  // 1. Asset Classes — must run first; other seeders reference their IDs.
  const assetClasses = await seedAssetClasses();

  // 2. Subscription Plans
  await seedPlans();

  // 3. System Settings
  await seedSystemSettings();

  // 4. Feature Flags
  await seedFeatureFlags();

  // 5. Demo Assets (depends on asset class IDs)
  await seedDemoAssets(assetClasses);

  console.log('\n✅  Seed completed successfully!\n');
}

// ---------------------------------------------------------------------------
// Entry Point
// ---------------------------------------------------------------------------

main()
  .catch((error) => {
    console.error('\n❌  Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
