# ZESTIFY ⚡
**The Autonomous Financial Intelligence Platform**

Zestify is a next-generation AI-driven wealth management platform built for modern investors. It moves beyond standard budgeting apps to provide predictive portfolio intelligence, dynamic goal tracking, and actionable insights with extreme transparency.

## Features
- **ZUST AI Copilot**: An autonomous financial reasoning engine that outputs strictly compliant Probability, Confidence, Risk, and Explainable Reasoning metrics.
- **Financial Health Engine (Zest-Score)**: A proprietary algorithm calculating financial stability based on DTI, diversification, and savings rate.
- **Portfolio Intelligence**: Real-time asset tracking and diversification analysis.
- **Wealth Roadmap & What-If Simulator**: Interactive compounding projection engines.

## Tech Stack
- **Frontend**: Next.js 15, React 19, TailwindCSS, Shadcn UI
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL, Prisma ORM
- **Integrations**: NextAuth, Plaid (via mock seeders for hackathon), Razorpay, Vercel AI SDK

## Quick Start
```bash
docker-compose up -d
npm install
npm run generate --workspace=@zestify/db
npm run db:push --workspace=@zestify/db
npm run dev --workspace=api
npm run dev --workspace=web
```
Navigate to `http://localhost:3000` to start exploring.
