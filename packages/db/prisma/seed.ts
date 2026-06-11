import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database with Zestify Mock Data...')

  // Create Demo User
  const passwordHash = crypto.createHash('sha256').update('password').digest('hex')
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@zestify.com' },
    update: {},
    create: {
      email: 'demo@zestify.com',
      passwordHash,
      profile: {
        create: {
          firstName: 'Demo',
          lastName: 'User',
        }
      }
    }
  })

  // Create Mock Institution
  const institution = await prisma.institution.upsert({
    where: { plaidInsId: 'ins_1' },
    update: {},
    create: {
      plaidInsId: 'ins_1',
      name: 'Chase Bank',
    }
  })

  // Create Accounts
  const checking = await prisma.account.create({
    data: {
      userId: demoUser.id,
      institutionId: institution.id,
      name: 'Premier Checking',
      type: 'DEPOSITORY',
      currentBalance: 12456.20,
    }
  })

  const investment = await prisma.account.create({
    data: {
      userId: demoUser.id,
      institutionId: institution.id,
      name: 'Vanguard Brokerage',
      type: 'INVESTMENT',
      currentBalance: 112105.80,
    }
  })

  // Create Securities & Holdings
  const aapl = await prisma.security.upsert({
    where: { tickerSymbol: 'AAPL' },
    update: {},
    create: { tickerSymbol: 'AAPL', name: 'Apple Inc.', assetClass: 'EQUITY' }
  })
  
  const voo = await prisma.security.upsert({
    where: { tickerSymbol: 'VOO' },
    update: {},
    create: { tickerSymbol: 'VOO', name: 'Vanguard S&P 500 ETF', assetClass: 'EQUITY' }
  })

  await prisma.holding.create({
    data: {
      accountId: investment.id,
      securityId: aapl.id,
      quantity: 245.5,
      costBasis: 120.50,
      currentValue: 43596.70
    }
  })

  await prisma.holding.create({
    data: {
      accountId: investment.id,
      securityId: voo.id,
      quantity: 115.8,
      costBasis: 350.10,
      currentValue: 56052.90
    }
  })

  // Create Zest Score
  await prisma.zestScore.create({
    data: {
      userId: demoUser.id,
      score: 782,
      componentsJson: {
        debtToIncome: "A+",
        diversification: "B-",
        savingsRate: "A"
      }
    }
  })

  console.log('Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
