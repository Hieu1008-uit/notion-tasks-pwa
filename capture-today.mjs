import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/hieuv/.gemini/antigravity/brain/8cef97fb-44bc-4f67-b04b-f18bbd8c4450';

async function captureToday() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 1100 } });

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.click('header button:has-text("To Day")');
  await page.waitForTimeout(500);

  // Scroll down to 19:00 - 21:00 to see the real-time active task
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test-realtime-today.png'), fullPage: true });

  await browser.close();
}

captureToday();
