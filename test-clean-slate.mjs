import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/hieuv/.gemini/antigravity/brain/8cef97fb-44bc-4f67-b04b-f18bbd8c4450';

async function testCleanSlate() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 950 } });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:5173...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

  // 1. Check clean initial state in Tasks view
  const streakText = await page.$eval('header .text-amber-600', el => el.textContent?.trim());
  console.log('Initial Header Streak:', streakText);
  if (!streakText?.includes('0d Streak')) {
    throw new Error(`Expected 0d Streak, got ${streakText}`);
  }

  const emptyTaskPlaceholder = await page.$('text=Thư mục này chưa có công việc');
  console.log('Empty task placeholder present?', emptyTaskPlaceholder !== null);
  if (!emptyTaskPlaceholder) {
    throw new Error('Expected empty task placeholder on clean slate!');
  }

  console.log('Capturing clean-slate-tasks.png...');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'clean-slate-tasks.png'), fullPage: true });

  // 2. Check clean state in Habits tab
  console.log('Navigating to Habits tab...');
  await page.click('header button:has-text("Habits")');
  await page.waitForTimeout(400);

  const completedStat = await page.$eval('.grid > div:nth-child(1) .font-mono', el => el.textContent?.trim());
  console.log('Initial Completed Stat:', completedStat);
  if (completedStat !== '0') throw new Error(`Expected completed 0, got ${completedStat}`);

  const streakStat = await page.$eval('.grid > div:nth-child(2) .font-mono', el => el.textContent?.trim());
  console.log('Initial Streak Stat:', streakStat);
  if (streakStat !== '0d') throw new Error(`Expected streak 0d, got ${streakStat}`);

  const focusStat = await page.$eval('.grid > div:nth-child(3) .font-mono', el => el.textContent?.trim());
  console.log('Initial Focus Stat:', focusStat);

  const rateStat = await page.$eval('.grid > div:nth-child(4) .font-mono', el => el.textContent?.trim());
  console.log('Initial Success Rate:', rateStat);
  if (rateStat !== '0%') throw new Error(`Expected success rate 0%, got ${rateStat}`);

  console.log('Capturing clean-slate-habits.png...');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'clean-slate-habits.png'), fullPage: true });

  // 3. User usage simulation: Click "Check-in today" on a board
  console.log('Simulating user action: Click Check-in today...');
  await page.click('button:has-text("Check-in today")');
  await page.waitForTimeout(500);

  const updatedStreak = await page.$eval('.grid > div:nth-child(2) .font-mono', el => el.textContent?.trim());
  console.log('Updated Streak Stat after check-in:', updatedStreak);
  if (updatedStreak !== '1d') throw new Error(`Expected streak 1d, got ${updatedStreak}`);

  const updatedHeaderStreak = await page.$eval('header .text-amber-600', el => el.textContent?.trim());
  console.log('Updated Header Streak:', updatedHeaderStreak);
  if (!updatedHeaderStreak?.includes('1d Streak')) {
    throw new Error(`Expected 1d Streak in header, got ${updatedHeaderStreak}`);
  }

  // 4. User adds a task in Tasks tab
  console.log('Navigating back to Tasks tab...');
  await page.click('header button:has-text("Tasks")');
  await page.waitForTimeout(400);

  console.log('Adding new task...');
  await page.click('button:has-text("Thêm việc")');
  await page.waitForSelector('text=Create New Task');
  await page.fill('input[placeholder*="Finish Spring Boot"]', 'Lập trình tính năng Clean Slate cho ứng dụng');
  await page.click('button:has-text("Save Task")');
  await page.waitForTimeout(400);

  const addedTask = await page.$('text=Lập trình tính năng Clean Slate');
  console.log('New task added successfully?', addedTask !== null);
  if (!addedTask) throw new Error('Task was not added properly!');

  console.log('Capturing active-usage-tasks.png...');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'active-usage-tasks.png'), fullPage: true });

  await browser.close();
  console.log('ALL CLEAN SLATE VERIFICATIONS PASSED 100%!');
}

testCleanSlate().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
