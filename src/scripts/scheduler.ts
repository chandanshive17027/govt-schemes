// src/scripts/scheduler.ts
// Script to schedule the scraper to run daily at 2 AM
import cron from "node-cron";
import fetch from "node-fetch";

// Schedule to run every day at 2 AM
cron.schedule("0 2 * * *", async () => {
  try {
    console.log("Scraping started...");
    const res = await fetch("http://localhost:3000/api/scrape-schemes");
    const data = await res.json() as { count: number };
    console.log("Scraping finished. Schemes updated:", data.count);
  } catch (err) {
    console.error("Error running scraper:", err);
  }
});

console.log("Scheduler is running...");
