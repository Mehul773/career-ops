import { chromium } from 'playwright';
import { launch } from 'cloakbrowser';

const GENERIC_URL = 'https://www.naukri.com/node-js-jobs-in-ahmedabad';
const SINGLE_URL = 'https://www.naukri.com/job-listings-backend-developer-node-js-python-sunbots-innovations-ahmedabad-2-to-4-years-211024503694?src=seo_srp&sid=17810152128209330&xp=1&px=1';

async function testPlaywright(url, label) {
  console.log(`\n[Playwright] Testing ${label}...`);
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(5000);
    const title = await page.title();
    const bodyText = await page.innerText('body');
    const isBlocked = bodyText.includes('Cloudflare') || bodyText.includes('Access Denied') || bodyText.includes('Attention Required');
    
    console.log(`- Page Title: "${title}"`);
    console.log(`- Access Blocked: ${isBlocked ? '❌ YES' : '✅ NO'}`);
    console.log(`- Body Length: ${bodyText.length} characters`);
    if (isBlocked) {
      console.log(`- Blocked snippet: "${bodyText.substring(0, 200).replace(/\s+/g, ' ')}..."`);
    } else {
      console.log(`- Clean snippet: "${bodyText.substring(0, 200).replace(/\s+/g, ' ')}..."`);
    }
  } catch (err) {
    console.error(`- Playwright Error: ${err.message}`);
  } finally {
    await browser.close();
  }
}

async function testCloakBrowser(url, label) {
  console.log(`\n[CloakBrowser] Testing ${label}...`);
  let browser;
  try {
    browser = await launch({
      headless: true,
      humanize: true
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(5000);
    const title = await page.title();
    const bodyText = await page.innerText('body');
    const isBlocked = bodyText.includes('Cloudflare') || bodyText.includes('Access Denied') || bodyText.includes('Attention Required');
    
    console.log(`- Page Title: "${title}"`);
    console.log(`- Access Blocked: ${isBlocked ? '❌ YES' : '✅ NO'}`);
    console.log(`- Body Length: ${bodyText.length} characters`);
    if (isBlocked) {
      console.log(`- Blocked snippet: "${bodyText.substring(0, 200).replace(/\s+/g, ' ')}..."`);
    } else {
      console.log(`- Clean snippet: "${bodyText.substring(0, 200).replace(/\s+/g, ' ')}..."`);
    }
  } catch (err) {
    console.error(`- CloakBrowser Error: ${err.message}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

async function run() {
  console.log('=== NAUKRI BOT DETECTION TEST ===');
  
  // Test Generic URL
  await testPlaywright(GENERIC_URL, 'Generic Ahmedabad Node.js Jobs');
  await testCloakBrowser(GENERIC_URL, 'Generic Ahmedabad Node.js Jobs');
  
  // Test Single Job URL
  await testPlaywright(SINGLE_URL, 'Sunbots Innovations Single Job');
  await testCloakBrowser(SINGLE_URL, 'Sunbots Innovations Single Job');
}

run();
