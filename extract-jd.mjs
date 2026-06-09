import { chromium } from 'playwright';

async function extractJD() {
  const url = process.argv[2];
  if (!url) {
    console.error('Usage: node extract-jd.mjs <url>');
    process.exit(1);
  }

  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    // Give SPAs time to hydrate
    await page.waitForTimeout(2000);
    // Try to find the main content, or just get body text
    // Most JDs are in a specific container, but body text is a safe fallback
    const text = await page.innerText('body');
    console.log(text);
  } catch (err) {
    console.error('Error extracting JD:', err.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

extractJD();
