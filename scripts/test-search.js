import { chromium } from 'playwright';
import path from 'path';

async function getBaseUrl() {
  for (const port of [5173, 5174]) {
    try {
      const res = await fetch(`http://localhost:${port}`);
      if (res.ok) return `http://localhost:${port}`;
    } catch {}
  }
  return 'http://localhost:5173';
}

async function run() {
  const browser = await chromium.launch({ channel: 'chrome' }).catch(() => chromium.launch());
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });
  const baseUrl = await getBaseUrl();
  console.log(`Connected to active frontend at ${baseUrl}`);
  await page.goto(baseUrl, { waitUntil: 'networkidle' });

  // Navigate to Dashboard
  await page.locator('button:has-text("Browse Projects Inventory"), button[title*="Workspace"]').first().click();
  await page.waitForTimeout(500);

  console.log('--- TESTING DYNAMIC SEARCH BAR ---');
  const searchInput = page.locator('header input[type="text"]');
  await searchInput.click();
  await page.waitForTimeout(200);

  // Type 'mumbai'
  await searchInput.fill('mumbai');
  await page.waitForTimeout(300);

  // Check results dropdown
  const resultsDropdown = page.locator('.animate-in:has-text("Projects")');
  const isDropdownVisible = await resultsDropdown.isVisible();
  console.log(`Search dropdown visible after typing 'mumbai': ${isDropdownVisible}`);

  // Take screenshot of dynamic search
  const screenPath = path.resolve('artifacts/verification_screenshots/dynamic_search_desktop.png');
  await page.screenshot({ path: screenPath });
  console.log(`Saved dynamic search screenshot to ${screenPath}`);

  // Click on Mumbai project
  const firstProjectResult = page.locator('text=Mumbai Suburban Rail Corridor').first();
  if (await firstProjectResult.isVisible()) {
    await firstProjectResult.click();
    await page.waitForTimeout(500);
    console.log(`Navigated to Project Detail: ${page.url()} | Heading: ${await page.locator('h1').first().innerText()}`);
  }

  // Test Ctrl+K shortcut
  await page.keyboard.press('Control+k');
  await page.waitForTimeout(300);
  const inputFocused = await searchInput.evaluate(el => document.activeElement === el);
  console.log(`Search input focused on Ctrl+K: ${inputFocused}`);

  // Test typing 'mnn'
  await searchInput.fill('mnn');
  await page.waitForTimeout(300);
  const mnnScreenPath = path.resolve('artifacts/verification_screenshots/search_mnn_test.png');
  await page.screenshot({ path: mnnScreenPath });
  console.log(`Saved 'mnn' search test screenshot to ${mnnScreenPath}`);

  await browser.close();
  console.log('--- DYNAMIC SEARCH TESTS COMPLETE ---');
}

run().catch(console.error);
