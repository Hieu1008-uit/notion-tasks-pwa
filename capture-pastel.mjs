import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/hieuv/.gemini/antigravity/brain/8cef97fb-44bc-4f67-b04b-f18bbd8c4450';

async function capture() {
  const browser = await chromium.launch({ headless: true });
  
  // 1. Desktop captures
  const desktopContext = await browser.newContext({
    viewport: { width: 1280, height: 850 }
  });
  const page = await desktopContext.newPage();

  console.log('Navigating to http://localhost:5173...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

  // Tasks view
  console.log('Capturing pastel-todo.png...');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'pastel-todo.png'), fullPage: true });

  // Click on 'To Day' tab in desktop navbar
  console.log('Switching to To Day...');
  await page.click('header button:has-text("To Day")');
  await page.waitForTimeout(400);
  console.log('Capturing pastel-today.png...');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'pastel-today.png'), fullPage: true });

  // Click on 'Habits' tab in desktop navbar
  console.log('Switching to Habits...');
  await page.click('header button:has-text("Habits")');
  await page.waitForTimeout(400);
  console.log('Capturing pastel-contributions.png...');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'pastel-contributions.png'), fullPage: true });

  await desktopContext.close();

  // 2. Mobile Viewport (412 x 892 - iPhone / Modern Phone ratio matching user's mockup)
  const mobileContext = await browser.newContext({
    viewport: { width: 412, height: 892 },
    isMobile: true
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(400);

  console.log('Capturing pastel-mobile-tasks.png...');
  await mobilePage.screenshot({ path: path.join(ARTIFACT_DIR, 'pastel-mobile-tasks.png'), fullPage: true });

  await mobileContext.close();
  await browser.close();
  console.log('All screenshots captured successfully!');
}

capture().catch(err => {
  console.error('Error capturing screenshots:', err);
  process.exit(1);
});
