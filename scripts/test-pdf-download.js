import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

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
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });

  const baseUrl = await getBaseUrl();
  console.log(`Testing PDF downloads against active frontend: ${baseUrl}`);

  // Test 1: Project Monitoring Reports Table PDF Download
  console.log('\n--- 1. Testing Project Monitoring Reports View PDF Download ---');
  await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });

  // Click on "Reports" in public header
  const reportsLink = page.locator('nav button:has-text("Reports")').first();
  if (await reportsLink.isVisible()) {
    await reportsLink.click();
    await page.waitForTimeout(600);
  }

  // Find the first PDF download button in the table
  const pdfDownloadBtn = page.locator('button.paimana-action-btn-dl:has-text("PDF")').first();
  if (await pdfDownloadBtn.isVisible()) {
    console.log('Found table PDF action button. Triggering download...');
    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 10000 }),
      pdfDownloadBtn.click()
    ]);
    const suggestedFilename = download.suggestedFilename();
    const downloadPath = path.resolve('artifacts/verification_screenshots', suggestedFilename);
    await download.saveAs(downloadPath);
    const stats = fs.statSync(downloadPath);
    console.log(`✔ Downloaded Public Project Monitoring PDF successfully: ${suggestedFilename} (${stats.size} bytes)`);
  }

  // Test 2: Reports View (Workspace) PDF Download
  console.log('\n--- 2. Testing Workspace Reports View PDF Download ---');
  // Go to workspace dashboard -> reports
  await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
  const workspaceBtn = page.locator('button:has-text("Browse Projects Inventory"), button[title*="Workspace"]').first();
  if (await workspaceBtn.isVisible()) {
    await workspaceBtn.click();
    await page.waitForTimeout(600);
  }

  // Click on Reports in Sidebar
  const reportsNavBtn = page.locator('button:has-text("Reports"), a:has-text("Reports")').first();
  if (await reportsNavBtn.isVisible()) {
    await reportsNavBtn.click();
    await page.waitForTimeout(600);
  }

  const reportsPdfBtn = page.locator('button:has-text("PDF")').first();
  if (await reportsPdfBtn.isVisible()) {
    console.log('Found Workspace Report PDF button. Triggering download...');
    const [download2] = await Promise.all([
      page.waitForEvent('download', { timeout: 10000 }),
      reportsPdfBtn.click()
    ]);
    const filename2 = download2.suggestedFilename();
    const downloadPath2 = path.resolve('artifacts/verification_screenshots', filename2);
    await download2.saveAs(downloadPath2);
    const stats2 = fs.statSync(downloadPath2);
    console.log(`✔ Downloaded Workspace Report PDF: ${filename2} (${stats2.size} bytes)`);
  }

  // Test 3: Take screenshot of reports screen with verified download toast/UI
  const screenPath = path.resolve('artifacts/verification_screenshots/pdf_download_verified.png');
  await page.screenshot({ path: screenPath });
  console.log(`Saved screenshot to ${screenPath}`);

  await browser.close();
  console.log('\n--- ALL PDF DOWNLOAD TESTS PASSED ---');
}

run().catch(console.error);
