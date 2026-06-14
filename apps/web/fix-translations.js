const fs = require('fs');
const path = require('path');

const transDir = path.join(__dirname, 'src', 'lib', 'translations');
const langs = ['fr.ts', 'hi.ts', 'ja.ts', 'ko.ts'];

for (const lang of langs) {
  const filePath = path.join(transDir, lang);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Replace nav
  content = content.replace(/nav: \{([^}]+)\}/, (match, inner) => {
    if (!inner.includes('news:')) inner += ', news: "News"';
    return `nav: {${inner}}`;
  });
  
  // Replace pages
  content = content.replace(/pages: \{([^}]+)\}/, (match, inner) => {
    if (!inner.includes('newsHub:')) inner += ', newsHub: "News Hub"';
    return `pages: {${inner}}`;
  });
  
  // Replace dashboard
  content = content.replace(/dashboard: \{([^}]+)\}/, (match, inner) => {
    if (!inner.includes('goodMorning:')) inner += ', goodMorning: "Good Morning", goodAfternoon: "Good Afternoon", goodEvening: "Good Evening", marketPulse: "Market Pulse", todayInsights: "Today\'s Insights", liveData: "Live Data"';
    return `dashboard: {${inner}}`;
  });

  // Add missing 'news' root object if it doesn't exist
  if (!content.includes('news: {')) {
    content = content.replace(/landing: \{/, `news: { title: "Finance & Business News", description: "AI-curated news with actionable insights.", featured: "Featured", trending: "Trending", allNews: "All News", analyzeWithAi: "Analyze with ZUST AI", readSource: "Read Source", aiInsight: "AI Insight", trendingTopics: "Trending Topics", basedOnPortfolio: "Based on your portfolio", refreshing: "Refreshing...", noNews: "No news available right now.", categories: { market: "Market", business: "Business", technology: "Technology", economy: "Economy", all: "All" } },\n  landing: {`);
  }

  fs.writeFileSync(filePath, content);
}

console.log("Translations fixed!");
