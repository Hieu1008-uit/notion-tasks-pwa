import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/hieuv/.gemini/antigravity/brain/8cef97fb-44bc-4f67-b04b-f18bbd8c4450';

async function testAll() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:5173...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

  // 1. Verify Desktop Navbar has NO '+' button next to streak
  const desktopPlusBtn = await page.$('header button[title="Thêm công việc mới"]');
  console.log('Desktop header "+" button is null?', desktopPlusBtn === null);
  if (desktopPlusBtn !== null) throw new Error('Desktop header "+" button should have been removed!');

  // 2. Verify Streak in header
  const headerStreak = await page.$eval('header .text-amber-600', el => el.textContent?.trim());
  console.log('Header Streak:', headerStreak);

  // 3. Test Edit Board Modal in Tasks View
  console.log('Opening Edit Board Modal...');
  await page.click('button[title="Chỉnh sửa màu sắc & tên board"]');
  await page.waitForSelector('text=Chỉnh sửa Board');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test-edit-board-modal.png') });

  // Change color to Lavender and save
  await page.click('button:has-text("Lavender")');
  await page.click('button:has-text("Lưu thay đổi")');
  await page.waitForTimeout(400);

  // 4. Test clicking on Board navigates to Schedule Today filtered by that board!
  console.log('Clicking on active board to navigate to Schedule Today filtered...');
  await page.click('div[title*="Nhấn vào board để mở Schedule Today"]');
  await page.waitForTimeout(400);

  // Verify filter banner appears
  const filterBanner = await page.$('text=Đang lọc theo Board:');
  console.log('Filter banner present?', filterBanner !== null);
  if (!filterBanner) throw new Error('Expected filter banner on Schedule Today after clicking board!');

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test-filtered-schedule.png') });

  // Clear filter
  await page.click('button:has-text("Xem tất cả task")');
  await page.waitForTimeout(300);

  // 5. Check Habits tab for synced Categorised Habit Boards and synced streak
  console.log('Switching to Habits...');
  await page.click('header button:has-text("Habits")');
  await page.waitForTimeout(400);

  const habitStreak = await page.$eval('.text-amber-500.font-mono', el => el.textContent?.trim());
  console.log('Habits tab Streak:', habitStreak);

  const habitBoards = await page.$$eval('.space-y-3 > div', els => els.length);
  console.log('Number of Habit Boards:', habitBoards);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test-synced-habits.png') });

  // 6. Test mobile viewport
  console.log('Testing mobile dock...');
  await page.setViewportSize({ width: 412, height: 892 });
  await page.waitForTimeout(300);
  const mobilePlus = await page.$('.md\\:hidden button[title="Thêm công việc mới"]');
  console.log('Mobile dock "+" button present?', mobilePlus !== null);
  if (!mobilePlus) throw new Error('Expected mobile "+" button to be present!');

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test-mobile-refinements.png') });

  await browser.close();
  console.log('ALL TESTS PASSED WITH 100% SUCCESS!');
}

testAll().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
