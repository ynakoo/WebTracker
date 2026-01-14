const API_URL = "http://localhost:3000"; // CHANGE THIS to your hosted backend URL (e.g., https://your-app.onrender.com)

async function categorizeLogs(summary) {
  const domains = Object.keys(summary);
  const res = await fetch(`${API_URL}/categorize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ domains })
  });
  const categories = await res.json();
  if (res.err) {
    return null
  }
  const report = {};
  for (let [domain, category] of Object.entries(categories)) {
    report[category] = (report[category] || 0) + Math.round(summary[domain] / 60000);// minutes
  }
  return report;
}