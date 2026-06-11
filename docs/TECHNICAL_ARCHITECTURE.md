# Technical Architecture

Zestify is engineered as a scalable, enterprise-grade SaaS platform capable of supporting thousands of concurrent users.

## 1. Monorepo Structure
We utilized NPM Workspaces to create a strict separation of concerns:
- `apps/web`: The Next.js frontend application.
- `apps/api`: The Express.js backend microservice.
- `packages/db`: A shared Prisma ORM library.

## 2. Frontend Layer (Next.js 15)
- **Framework**: Next.js App Router for Server-Side Rendering (SSR) and superior SEO/performance.
- **Styling**: TailwindCSS combined with Shadcn UI for a premium, accessible, and highly customizable "Dark Mode First" design system.
- **State Management**: React Server Components for secure data fetching, supplemented by client-side hooks for interactive simulators.

## 3. Backend Layer (Express & Node.js)
While Next.js API routes handle authentication, complex financial calculations and webhook handling are offloaded to a dedicated Express.js server (`apps/api`). This allows for horizontal scaling of the heavy computational tasks independent of the frontend delivery.

## 4. Data Layer (PostgreSQL & Prisma)
- **Database**: PostgreSQL hosted on a highly available cloud provider (e.g., Supabase or Neon).
- **ORM**: Prisma provides end-to-end type safety from the database schema all the way to the React components. 
- **Security**: Passwords are cryptographically hashed, and sensitive Plaid tokens are AES-encrypted at rest.

## 5. Third-Party Integrations
- **Authentication**: NextAuth.js handling Google OAuth and secure Credentials fallback.
- **Aggregation**: Designed for Plaid Link to fetch live banking and brokerage data.
- **Payments**: Razorpay integrated for the Pro-tier subscription billing with secure Webhook listeners.
- **AI**: Vercel AI SDK interface prepared to securely stream outputs from OpenAI or Google Gemini.
