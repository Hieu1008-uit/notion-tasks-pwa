import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('https://beaverplans.com/', { waitUntil: 'networkidle' });

  // Click skip guide
  const skipBtn = page.locator('button:has-text("Skip guide")');
  if (await skipBtn.count() > 0) {
    await skipBtn.click();
    await page.waitForTimeout(1000);
  }
  await page.screenshot({ path: 'beaverplans-planner.png', fullPage: true });

  // Click STATS tab
  const statsBtn = page.locator('button:has-text("STATS"), a:has-text("STATS")');
  if (await statsBtn.count() > 0) {
    await statsBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'beaverplans-stats.png', fullPage: true });
  }

  // Click WEEKS tab
  const weeksBtn = page.locator('button:has-text("WEEKS"), a:has-text("WEEKS")');
  if (await weeksBtn.count() > 0) {
    await weeksBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'beaverplans-weeks.png', fullPage: true });
  }

  await browser.close();
}

main();
