import { chromium } from 'playwright';

async function testTimer() {
  console.log('🚀 Testing custom timer adjustment features...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  try {
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

    // 1. Initial time: 25:00
    await page.waitForSelector('text=25:00');
    console.log('✅ Initial timer shows 25:00');

    // 2. Click +5m button
    await page.click('button[title="Thêm 5 phút"]');
    await page.waitForSelector('text=30:00');
    console.log('✅ +5m button worked: timer changed to 30:00');

    // 3. Click -5m button
    await page.click('button[title="Giảm 5 phút"]');
    await page.waitForSelector('text=25:00');
    console.log('✅ -5m button worked: timer changed back to 25:00');

    // 4. Click "Tùy chỉnh" to enter custom minutes (e.g. 42)
    await page.click('button:has-text("Tùy chỉnh")');
    const input = page.locator('input[type="number"]');
    await input.fill('42');
    await page.keyboard.press('Enter');
    await page.waitForSelector('text=42:00');
    console.log('✅ Custom minute direct typing worked: timer is now 42:00!');

    // 5. Test clicking "Focus" on a task
    // Task 1: "Hoàn thành bài thực hành Spring Boot Security" is 09:00 - 11:00 (120 mins)
    const focusBtn = page.locator('button[data-testid="task-focus-btn"]').first();
    await focusBtn.click();
    await page.waitForSelector('text=120:00');
    console.log('✅ Task Focus auto-sync worked: timer set to 120:00 (task duration)!');

    // Screenshot
    await page.screenshot({ path: 'custom-timer.png' });
    console.log('✅ Screenshot captured: custom-timer.png');

    console.log('🎉 ALL CUSTOM TIMER FEATURES VERIFIED 100%!');
  } catch (err) {
    console.error('❌ Timer test failed:', err);
  } finally {
    await browser.close();
  }
}

testTimer();
