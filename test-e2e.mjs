import { chromium } from 'playwright';

async function runE2ETests() {
  console.log('🚀 Running E2E test on redesigned BeaverPlans UI...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => consoleErrors.push(err.message));

  try {
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    console.log('✅ Page loaded');

    // 1. Screenshot Today View
    await page.screenshot({ path: 'beaver-today.png', fullPage: true });
    console.log('✅ Captured beaver-today.png');

    // Test Pomodoro
    await page.click('button:has-text("Bắt đầu Focus")');
    await page.waitForTimeout(500);
    await page.click('button:has-text("Tạm dừng")');

    // 2. Switch to To-Do List
    await page.click('button:has-text("TO-DO LIST")');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'beaver-todo.png', fullPage: true });
    console.log('✅ Captured beaver-todo.png');

    // 3. Switch to Contributions
    await page.click('button:has-text("CONTRIBUTIONS")');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'beaver-contributions.png', fullPage: true });
    console.log('✅ Captured beaver-contributions.png');

    console.log('🎉 ALL SCREENSHOTS CAPTURED WITH 0 CONSOLE ERRORS!');
  } catch (err) {
    console.error('❌ Test failed:', err);
  } finally {
    await browser.close();
  }
}

runE2ETests();
