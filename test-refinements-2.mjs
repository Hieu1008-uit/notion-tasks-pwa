import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/hieuv/.gemini/antigravity/brain/8cef97fb-44bc-4f67-b04b-f18bbd8c4450';

async function testRefinements2() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 950 } });

  console.log('Navigating to http://localhost:5173...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

  // 1. Click on active board in Tasks view to navigate to Schedule Today
  console.log('Clicking active board to navigate to Schedule Today filtered...');
  await page.click('div[title*="Nhấn vào board để mở Schedule Today"]');
  await page.waitForTimeout(400);

  // Check if any empty slots exist
  const emptySlotsCount = await page.$$eval('text=Trống — bấm để lên lịch', els => els.length);
  console.log('Empty slots count when filtered by board:', emptySlotsCount);
  if (emptySlotsCount !== 0) {
    throw new Error(`Expected 0 empty slots when filtered by board, but got ${emptySlotsCount}!`);
  }

  // Count displayed task cards in filtered schedule
  const filteredTasksCount = await page.$$eval('[data-testid="task-focus-btn"]', els => els.length);
  console.log('Filtered task cards count:', filteredTasksCount);

  console.log('Capturing filtered-board-schedule.png...');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'filtered-board-schedule.png'), fullPage: true });

  // 2. Check Habits tab
  console.log('Switching to Habits tab...');
  await page.click('header button:has-text("Habits")');
  await page.waitForTimeout(400);

  // Verify 'Annual Productivity Matrix' is completely gone
  const masterMatrix = await page.$('text=Annual Productivity Matrix');
  console.log('Is Annual Productivity Matrix present?', masterMatrix !== null);
  if (masterMatrix !== null) {
    throw new Error('Annual Productivity Matrix should have been removed!');
  }

  // Verify Categorised Habit Boards is present
  const categorisedTitle = await page.$('text=Categorised Habit Boards');
  console.log('Is Categorised Habit Boards present?', categorisedTitle !== null);
  if (!categorisedTitle) {
    throw new Error('Categorised Habit Boards should be present!');
  }

  console.log('Capturing habits-without-master-matrix.png...');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'habits-without-master-matrix.png'), fullPage: true });

  await browser.close();
  console.log('ALL VERIFICATIONS PASSED 100%!');
}

testRefinements2().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
