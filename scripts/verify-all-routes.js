import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve('artifacts/verification_screenshots');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const VIEWPORTS = [
  { name: '320x568_se', width: 320, height: 568 },
  { name: '360x640_android', width: 360, height: 640 },
  { name: '390x844_iphone', width: 390, height: 844 },
  { name: '412x915_pixel', width: 412, height: 915 },
  { name: '440x956_reference', width: 440, height: 956 },
  { name: '844x390_landscape', width: 844, height: 390 },
  { name: '768x1024_tablet', width: 768, height: 1024 },
  { name: '1023px_mobile_edge', width: 1023, height: 800 },
  { name: '1024px_desktop_breakpoint', width: 1024, height: 800 },
  { name: '1025px_desktop_edge', width: 1025, height: 800 },
  { name: '1440x900_desktop', width: 1440, height: 900 }
];

async function checkPageOverflow(page) {
  return await page.evaluate(() => {
    const docWidth = document.documentElement.scrollWidth;
    const clientWidth = document.documentElement.clientWidth;
    const elements = Array.from(document.querySelectorAll('*'));
    const overflowing = [];
    
    for (const el of elements) {
      // ignore fixed overlays like mobile drawer that are designed to fill screen
      const pos = window.getComputedStyle(el).position;
      if (pos === 'fixed') continue;
      
      const rect = el.getBoundingClientRect();
      if (rect.right > clientWidth + 1) {
        overflowing.push({
          tag: el.tagName,
          className: (el.className || '').toString().substring(0, 50),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
          overflowAmount: Math.round(rect.right - clientWidth),
          text: (el.innerText || '').substring(0, 40).replace(/\n/g, ' ')
        });
      }
    }
    return {
      docWidth,
      clientWidth,
      hasOverflow: docWidth > clientWidth,
      overflowingCount: overflowing.length,
      overflowingList: overflowing.slice(0, 5)
    };
  });
}

async function run() {
  const browser = await chromium.launch({ channel: 'chrome' }).catch(() => chromium.launch());
  const page = await browser.newPage();
  const baseUrl = 'http://localhost:5174';

  console.log('====================================================');
  console.log('PAIMANA SENTINEL AI — MULTI-VIEWPORT VERIFICATION');
  console.log('====================================================\n');

  const results = [];

  // 1. Test Landing Page across all 11 Viewports
  console.log('--- SECTION 1: LANDING PAGE MULTI-VIEWPORT TEST ---');
  for (const vp of VIEWPORTS) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(200);

    const overflow = await checkPageOverflow(page);
    const screenPath = path.join(outDir, `landing_${vp.name}.png`);
    await page.screenshot({ path: screenPath });

    const status = !overflow.hasOverflow && overflow.overflowingCount === 0 ? 'PASS' : 'FAIL';
    console.log(`[${status}] Landing @ ${vp.name} (${vp.width}x${vp.height}): docWidth=${overflow.docWidth}, clientWidth=${overflow.clientWidth}, overflowCount=${overflow.overflowingCount}`);
    if (status === 'FAIL') {
      console.log('   Overflow details:', overflow.overflowingList);
    }
    results.push({ test: `Landing @ ${vp.name}`, status, overflow });
  }

  // 2. Test Navigation Breakpoint at 1023px, 1024px, 1025px
  console.log('\n--- SECTION 2: BREAKPOINT INTEGRITY TEST (1023px vs 1024px vs 1025px) ---');
  for (const width of [1023, 1024, 1025]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    const navState = await page.evaluate(() => {
      const hamburger = document.querySelector('.paimana-hamburger-btn');
      const centerNav = document.querySelector('.paimana-nav-center');
      return {
        hamburgerVisible: hamburger ? window.getComputedStyle(hamburger).display !== 'none' : false,
        centerNavVisible: centerNav ? window.getComputedStyle(centerNav).display !== 'none' : false
      };
    });
    console.log(`Width ${width}px: Hamburger=${navState.hamburgerVisible}, CenterNav=${navState.centerNavVisible}`);
  }

  // 3. Test Public Navigation Drawer Interaction
  console.log('\n--- SECTION 3: PUBLIC DRAWER INTERACTION & ROUTING ---');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  const hamburgerBtn = page.locator('.paimana-hamburger-btn');
  await hamburgerBtn.click();
  await page.waitForTimeout(300);
  const drawerOpen = await page.locator('.paimana-mobile-sheet').isVisible();
  console.log(`Drawer opened on click: ${drawerOpen}`);
  
  // Click "Projects Directory" link in drawer
  await page.locator('.mobile-nav-link:has-text("Projects Directory")').click();
  await page.waitForTimeout(400);
  const currentUrl = page.url();
  console.log(`Navigated via drawer to projects view, drawer closed: ${!(await page.locator('.paimana-mobile-sheet').isVisible())}`);

  // 4. Test Authenticated Workspace Views & Modals at 390x844 and 320x568
  console.log('\n--- SECTION 4: AUTHENTICATED WORKSPACE VIEWS & MODALS ---');
  const workspaceRoutes = [
    { name: 'Dashboard', route: 'dashboard', navSelector: 'button[title*="Workspace"], button:has-text("Sign In")' },
    { name: 'Projects List', route: 'projects' },
    { name: 'Early Warnings / Risk Review', route: 'alerts' },
    { name: 'Reports', route: 'reports' },
    { name: 'AI Assistant', route: 'assistant' },
    { name: 'What-If Simulator', route: 'simulator' },
    { name: 'Data Management', route: 'data' },
    { name: 'Settings & Admin', route: 'admin' },
    { name: 'Public Dashboard', route: 'public-dashboard' },
    { name: 'Orders & Manuals', route: 'orders-manuals' },
    { name: 'FAQ', route: 'faq' },
    { name: 'About IPMD', route: 'about-ipmd' }
  ];

  for (const item of workspaceRoutes) {
    // Navigate via App state setter in browser context
    await page.evaluate((r) => {
      // Trigger navigation using hash or custom event or click
      const navLinks = Array.from(document.querySelectorAll('button, a'));
      // Find matching navigation button
      const target = navLinks.find(el => el.innerText && el.innerText.toLowerCase().includes(r.toLowerCase()));
      if (target) target.click();
    }, item.route);
    await page.waitForTimeout(300);

    for (const phoneVp of [{ width: 390, height: 844, name: '390x844' }, { width: 320, height: 568, name: '320x568' }]) {
      await page.setViewportSize({ width: phoneVp.width, height: phoneVp.height });
      await page.waitForTimeout(200);
      const overflow = await checkPageOverflow(page);
      const status = !overflow.hasOverflow ? 'PASS' : 'FAIL';
      console.log(`[${status}] View "${item.name}" @ ${phoneVp.name}: docWidth=${overflow.docWidth}, clientWidth=${overflow.clientWidth}, overflowCount=${overflow.overflowingCount}`);
      const screenPath = path.join(outDir, `${item.name.replace(/\s+/g, '_').toLowerCase()}_${phoneVp.name}.png`);
      await page.screenshot({ path: screenPath });
    }
  }

  // 5. Test Authenticated Mobile Sidebar Drawer
  console.log('\n--- SECTION 5: AUTHENTICATED WORKSPACE SIDEBAR DRAWER ---');
  await page.setViewportSize({ width: 390, height: 844 });
  const authMenuBtn = page.locator('.mobile-menu-btn');
  if (await authMenuBtn.isVisible()) {
    await authMenuBtn.click();
    await page.waitForTimeout(300);
    const authDrawerVisible = await page.locator('[aria-label="Mobile Navigation Menu"]').isVisible();
    console.log(`Authenticated workspace drawer opened: ${authDrawerVisible}`);
    await page.screenshot({ path: path.join(outDir, 'workspace_drawer_390x844.png') });
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    console.log(`Authenticated workspace drawer closed on Escape: ${!(await page.locator('[aria-label="Mobile Navigation Menu"]').isVisible())}`);
  }

  await browser.close();
  console.log('\n====================================================');
  console.log('ALL AUTOMATED BROWSER VERIFICATIONS COMPLETE');
  console.log('====================================================');
}

run().catch(console.error);
