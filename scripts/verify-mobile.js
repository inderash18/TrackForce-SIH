import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve('artifacts/verification_screenshots');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function run() {
  const browser = await chromium.launch({ channel: 'chrome' }).catch(() => chromium.launch());
  const page = await browser.newPage();
  
  const testUrl = 'http://localhost:5174';
  console.log(`Navigating to ${testUrl} at 440x956...`);
  await page.setViewportSize({ width: 440, height: 956 });
  await page.goto(testUrl, { waitUntil: 'networkidle' });

  // Measure document dimensions and find any overflowing elements
  const metrics = await page.evaluate(() => {
    const docWidth = document.documentElement.scrollWidth;
    const clientWidth = document.documentElement.clientWidth;
    const bodyWidth = document.body.scrollWidth;
    
    const elements = Array.from(document.querySelectorAll('*'));
    const overflowing = [];
    
    for (const el of elements) {
      const rect = el.getBoundingClientRect();
      if (rect.right > clientWidth + 1) {
        overflowing.push({
          tag: el.tagName,
          className: el.className,
          id: el.id,
          right: rect.right,
          width: rect.width,
          clientWidth: clientWidth,
          overflowAmount: rect.right - clientWidth,
          textSnippet: el.innerText ? el.innerText.substring(0, 60).replace(/\n/g, ' ') : ''
        });
      }
    }
    
    // Inspect specific elements
    const heroContainer = document.querySelector('.paimana-hero-container');
    const heroCaption = document.querySelector('.paimana-hero-caption-box');
    const heroTag = document.querySelector('.paimana-hero-tag');
    const heroHeading = document.querySelector('.paimana-hero-heading');
    const heroActions = document.querySelector('.paimana-hero-actions');
    const heroControls = document.querySelector('.paimana-hero-controls-bar');
    const sectionTitle = document.querySelector('.paimana-section-title');
    const macroGrid = document.querySelector('.paimana-macro-cards-grid');
    const headerInner = document.querySelector('.paimana-navbar-inner');
    const hamburgerBtn = document.querySelector('.paimana-hamburger-btn');
    const navCenter = document.querySelector('.paimana-nav-center');
    
    return {
      docWidth,
      clientWidth,
      bodyWidth,
      hasOverflow: docWidth > clientWidth,
      overflowingCount: overflowing.length,
      topOverflowing: overflowing.slice(0, 10),
      heroContainerRect: heroContainer ? heroContainer.getBoundingClientRect() : null,
      heroCaptionRect: heroCaption ? heroCaption.getBoundingClientRect() : null,
      heroTagRect: heroTag ? heroTag.getBoundingClientRect() : null,
      heroHeadingRect: heroHeading ? heroHeading.getBoundingClientRect() : null,
      heroActionsRect: heroActions ? heroActions.getBoundingClientRect() : null,
      heroControlsRect: heroControls ? heroControls.getBoundingClientRect() : null,
      sectionTitleRect: sectionTitle ? sectionTitle.getBoundingClientRect() : null,
      macroGridRect: macroGrid ? macroGrid.getBoundingClientRect() : null,
      hamburgerVisible: hamburgerBtn ? window.getComputedStyle(hamburgerBtn).display !== 'none' : false,
      navCenterVisible: navCenter ? window.getComputedStyle(navCenter).display !== 'none' : false,
      headerInnerRect: headerInner ? headerInner.getBoundingClientRect() : null
    };
  });

  console.log('\n--- LANDING PAGE METRICS (440x956) ---');
  console.log(`Viewport clientWidth: ${metrics.clientWidth}px | doc scrollWidth: ${metrics.docWidth}px`);
  console.log(`Has horizontal overflow: ${metrics.hasOverflow}`);
  console.log(`Hamburger button visible: ${metrics.hamburgerVisible}`);
  console.log(`Desktop nav center visible: ${metrics.navCenterVisible}`);
  console.log(`Hero caption rect:`, metrics.heroCaptionRect);
  console.log(`Hero controls rect:`, metrics.heroControlsRect);
  console.log(`Section title rect:`, metrics.sectionTitleRect);
  console.log(`Macro grid rect:`, metrics.macroGridRect);
  console.log(`Overflowing elements count: ${metrics.overflowingCount}`);
  if (metrics.overflowingCount > 0) {
    console.log(`Top overflowing elements:`, metrics.topOverflowing);
  }

  // Capture screenshot of landing at 440x956
  const landingScreenPath = path.join(outDir, 'landing_440x956.png');
  await page.screenshot({ path: landingScreenPath, fullPage: false });
  console.log(`Saved screenshot to ${landingScreenPath}`);

  // Test mobile menu interaction
  console.log('\n--- TESTING MOBILE MENU INTERACTION ---');
  const hamburger = page.locator('.paimana-hamburger-btn');
  if (await hamburger.isVisible()) {
    await hamburger.click();
    await page.waitForTimeout(300);
    const drawerVisible = await page.locator('.paimana-mobile-sheet').isVisible();
    console.log(`Mobile drawer opened visible: ${drawerVisible}`);
    const drawerScreenPath = path.join(outDir, 'landing_drawer_440x956.png');
    await page.screenshot({ path: drawerScreenPath });
    console.log(`Saved drawer screenshot to ${drawerScreenPath}`);

    // Press Escape to test close
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    const drawerClosed = !(await page.locator('.paimana-mobile-sheet').isVisible());
    console.log(`Drawer closed on Escape: ${drawerClosed}`);
  } else {
    console.log('Hamburger button not visible!');
  }

  await browser.close();
}

run().catch(console.error);
