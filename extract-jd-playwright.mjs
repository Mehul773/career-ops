import { scrapeUrl } from './stealth-scraper.mjs';

async function main() {
  const url = process.argv[2];
  if (!url) {
    console.error('Usage: node extract-jd-playwright.mjs <url>');
    process.exit(1);
  }

  try {
    const result = await scrapeUrl(url);
    console.log(result.bodyText);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

main();
