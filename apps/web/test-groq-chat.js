async function run() {
  const res = await fetch("http://localhost:3000/api/ai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [{ role: "user", content: "AAPL" }]
    })
  });
  const text = await res.text();
  console.log("RESPONSE:", text);
}
run();
