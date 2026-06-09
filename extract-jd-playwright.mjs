import { chromium } from 'playwright';

async function main() {
  const url = process.argv[2];
  if (!url) {
    console.error('Usage: node extract-jd-playwright.mjs <url>');
    process.exit(1);
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    // Wait for content to load
    await page.waitForTimeout(5000);
    const content = await page.innerText('body');
    console.log(content);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

main();
