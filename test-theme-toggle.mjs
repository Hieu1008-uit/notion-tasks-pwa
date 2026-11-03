import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/hieuv/.gemini/antigravity/brain/8cef97fb-44bc-4f67-b04b-f18bbd8c4450';

async function testThemeToggle() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 950 } });

  console.log('Navigating to http://localhost:5173...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

  // 1. Ensure starting in light mode for screenshot
  const initialIsDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
  if (initialIsDark) {
    await page.click('button[aria-label="Toggle theme"]');
    await page.waitForTimeout(300);
  }

  console.log('Capturing light-mode-tasks.png...');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'light-mode-tasks.png'), fullPage: true });

  // 2. Click the theme toggle button to switch to Dark Mode
  console.log('Clicking Light/Dark theme toggle button...');
  await page.click('button[aria-label="Toggle theme"]');
  await page.waitForTimeout(400);

  // Verify .dark class is on <html>
  const isDarkAfterToggle = await page.evaluate(() => document.documentElement.classList.contains('dark'));
  console.log('Is <html> marked with "dark" class?', isDarkAfterToggle);
  if (!isDarkAfterToggle) throw new Error('Expected <html> to have class "dark" after toggle!');

  // Verify meta color-scheme
  const metaContent = await page.$eval('meta[name="color-scheme"]', el => el.getAttribute('content'));
  console.log('Meta color-scheme content:', metaContent);
  if (metaContent !== 'dark') throw new Error(`Expected meta color-scheme to be 'dark', got '${metaContent}'`);

  // Capture dark mode screenshots
  console.log('Capturing dark-mode-tasks.png...');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'dark-mode-tasks.png'), fullPage: true });

  // Switch to Today in dark mode
  console.log('Capturing dark-mode-today.png...');
  await page.click('header button:has-text("To Day")');
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'dark-mode-today.png'), fullPage: true });

  // Switch to Habits in dark mode
  console.log('Capturing dark-mode-habits.png...');
  await page.click('header button:has-text("Habits")');
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'dark-mode-habits.png'), fullPage: true });

  // 3. Mobile Viewport in Dark Mode
  console.log('Testing mobile dock in dark mode...');
  await page.setViewportSize({ width: 412, height: 892 });
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'dark-mode-mobile.png'), fullPage: true });

  await browser.close();
  console.log('ALL THEME TESTS PASSED 100%!');
}

testThemeToggle().catch(err => {
  console.error('Theme test error:', err);
  process.exit(1);
});
