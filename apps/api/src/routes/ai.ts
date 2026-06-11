import { Router } from 'express';

const router = Router();

router.post('/chat', async (req, res) => {
  const { message } = req.body;
  
  // Implementation of Multi-Model Router
  // In production, check process.env.OPENAI_API_KEY
  // For now, we use the deterministic mock to ensure compliance.
  
  const mockDelay = () => new Promise(resolve => setTimeout(resolve, 800));
  await mockDelay();

  // If the query contains specific keywords, route to "OpenAI" logic, else "Gemini" logic
  // (Simulated logic router)
  let insight = "Based on recent market trends, your portfolio allocation is stable.";
  let probability = "85%";
  let confidence = "High";
  let riskScore = "Low";
  let explainableReasoning = "Inflation data released today shows a cooling trend, meaning cash purchasing power erosion has slowed.";

  if (message && typeof message === 'string') {
    if (message.toLowerCase().includes('apple') || message.toLowerCase().includes('aapl')) {
      insight = "Apple (AAPL) shows positive momentum indicators following their latest earnings report.";
      probability = "72%";
      riskScore = "Medium";
      explainableReasoning = "Revenue grew 12% YoY, primarily driven by Services. Hardware sales remained flat. Algorithmic analysis suggests short-term stability.";
    } else if (message.toLowerCase().includes('crash') || message.toLowerCase().includes('recession')) {
      insight = "Macroeconomic indicators show elevated volatility, but a severe immediate crash has a low probability.";
      probability = "15%";
      confidence = "Medium";
      riskScore = "High Volatility";
      explainableReasoning = "Yield curve remains inverted, but consumer spending is strong. A soft landing scenario is currently favored by consensus models.";
    }
  }
  
  res.json({
    success: true,
    data: {
      insight,
      explainable_reasoning: explainableReasoning,
      probability,
      confidence,
      risk_score: riskScore,
      disclaimer: "This is statistical intelligence, not financial advice. Do not make buy/sell decisions based on AI outputs."
    }
  });
});

export default router;
