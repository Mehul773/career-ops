import { chromium } from 'playwright';
import { launch } from 'cloakbrowser';

const KNOWN_STEALTH_DOMAINS = [
  /naukri\.com/i,
  /linkedin\.com/i,
  /instahyre\.com/i,
  /wellfound\.com/i
];

export function shouldUseStealthDirectly(url) {
  return KNOWN_STEALTH_DOMAINS.some(regex => regex.test(url));
}

export function isBlockedContent(title, body) {
  if (!body) return true;
  const lowerTitle = (title || '').toLowerCase();
  const lowerBody = body.toLowerCase();
  
  return (
    lowerTitle.includes('access denied') ||
    lowerTitle.includes('attention required') ||
    lowerBody.includes('cloudflare') ||
    lowerBody.includes('access denied') ||
    lowerBody.includes('please enable cookies') ||
    lowerBody.includes('attention required') ||
    body.length < 500
  );
}

export async function scrapeUrl(url) {
  const useStealth = shouldUseStealthDirectly(url);
  if (useStealth) {
    console.log(`[stealth-scraper] Direct routing to CloakBrowser for protected domain: ${url}`);
    return runStealthScrape(url);
  }

  console.log(`[stealth-scraper] Attempting standard Playwright: ${url}`);
  try {
    return await runPlaywrightScrape(url);
  } catch (err) {
    console.warn(`[stealth-scraper] Standard Playwright failed: ${err.message}. Retrying with CloakBrowser...`);
    return runStealthScrape(url);
  }
}

async function runPlaywrightScrape(url) {
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });
    const page = await context.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(2000);
    
    const title = await page.title();
    const bodyText = await page.evaluate(() => document.body?.innerText ?? '');
    
    if (isBlockedContent(title, bodyText)) {
      throw new Error('Blocked by WAF / Access Denied');
    }
    
    const applyControls = await extractApplyControls(page);
    return { title, bodyText, applyControls, source: 'playwright' };
  } finally {
    await browser.close();
  }
}

async function runStealthScrape(url) {
  const browser = await launch({ headless: true, humanize: true });
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(4000);
    
    const title = await page.title();
    const bodyText = await page.evaluate(() => document.body?.innerText ?? '');
    const applyControls = await extractApplyControls(page);
    
    return { title, bodyText, applyControls, source: 'cloakbrowser' };
  } finally {
    await browser.close();
  }
}

export async function extractApplyControls(page) {
  return page.evaluate(() => {
    const candidates = Array.from(
      document.querySelectorAll('a, button, input[type="submit"], input[type="button"], [role="button"]')
    );
    return candidates
      .filter((element) => {
        if (element.closest('nav, header, footer')) return false;
        if (element.closest('[aria-hidden="true"]')) return false;
        const style = window.getComputedStyle(element);
        if (style.display === 'none' || style.visibility === 'hidden') return false;
        if (!element.getClientRects().length) return false;
        return Array.from(element.getClientRects()).some((rect) => rect.width > 0 && rect.height > 0);
      })
      .map((element) => {
        const label = [
          element.innerText,
          element.value,
          element.getAttribute('aria-label'),
          element.getAttribute('title'),
        ]
          .filter(Boolean)
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();
        return label;
      })
      .filter(Boolean);
  });
}
