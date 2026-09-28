import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch({ channel: 'chrome' }).catch(() => chromium.launch());
  const page = await browser.newPage();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:5174', { waitUntil: 'networkidle' });

  // Navigate to Dashboard
  await page.locator('button:has-text("Browse Projects Inventory"), button:has-text("Explore Public Dashboard"), button[title*="Workspace"]').first().click();
  await page.waitForTimeout(500);

  const overflowReport = await page.evaluate(() => {
    const clientWidth = document.documentElement.clientWidth;
    const elements = Array.from(document.querySelectorAll('*'));
    const list = [];
    for (const el of elements) {
      if (window.getComputedStyle(el).position === 'fixed') continue;
      const rect = el.getBoundingClientRect();
      if (rect.right > clientWidth + 1) {
        // Find if it's inside an intentional overflow-x-auto container
        let parent = el.parentElement;
        let insideScroll = false;
        while (parent && parent !== document.body) {
          const ox = window.getComputedStyle(parent).overflowX;
          if (ox === 'auto' || ox === 'scroll') {
            insideScroll = true;
            break;
          }
          parent = parent.parentElement;
        }
        
        list.push({
          tag: el.tagName,
          className: el.className,
          right: Math.round(rect.right),
          width: Math.round(rect.width),
          overflowAmount: Math.round(rect.right - clientWidth),
          insideScrollContainer: insideScroll,
          text: (el.innerText || '').substring(0, 50).replace(/\n/g, ' ')
        });
      }
    }
    return list;
  });

  console.log('Total overflow items:', overflowReport.length);
  console.log('Overflow outside scroll container:', overflowReport.filter(x => !x.insideScrollContainer));
  console.log('Overflow inside intentional scroll container (e.g. table):', overflowReport.filter(x => x.insideScrollContainer).length);

  await browser.close();
}

run().catch(console.error);
