async function categorizeLogs(summary) {
    const domains = Object.keys(summary);
    const res = await fetch("http://localhost:3000/categorize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domains })
    });
    const categories = await res.json();
    const report = {};
    for (let [domain, category] of Object.entries(categories)) {
      report[category] = (report[category] || 0) + Math.round(summary[domain] / 60000);// minutes
    }
    return report;
  }