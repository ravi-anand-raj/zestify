# Future Roadmap (Post-Hackathon)

Our vision for Zestify extends far beyond this hackathon. Here is our 12-month execution roadmap to transition from MVP to a revenue-generating startup.

## Q3 2026: The "Data Fidelity" Release
- **Plaid Integration**: Replace the mock database seeders with live, production Plaid API keys to sync real user bank accounts.
- **Real-Time Market Data**: Integrate Alpaca or IEX Cloud APIs so the Portfolio Intelligence dashboard calculates live P&L during market hours.
- **LLM Upgrade**: Transition ZUST AI from the deterministic router to a fully grounded RAG (Retrieval-Augmented Generation) pipeline using OpenAI `gpt-4o`.

## Q4 2026: The "Actionable Insights" Release
- **Tax-Loss Harvesting AI**: ZUST AI will actively scan connected brokerage accounts to find underwater assets that can be sold for tax deductions before year-end.
- **Automated Rebalancing Alerts**: If a user's portfolio drifts beyond their target Risk Profile (e.g., Apple stock grows to 40% of their net worth), Zestify sends an SMS alert to rebalance.
- **Mobile Application**: Port the Next.js responsive web app to a native React Native iOS application.

## Q1 2027: The "Execution" Release
- **Direct Trading Integration**: Partner with an executing broker-dealer API (like Alpaca) so users can execute the AI's rebalancing recommendations with a single tap inside Zestify, without leaving the app.
- **B2B Advisory Platform**: Launch a "Zestify for Advisors" dashboard, allowing human financial advisors to use our AI and Zest-Score metrics to manage their client book.
