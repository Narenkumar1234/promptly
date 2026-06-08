// Deep-probe Claude and Perplexity to find their actual visible input selectors

const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  });

  const probeInputs = async (page, label) => {
    console.log(`\n=== ${label} ===`);
    const results = await page.evaluate(() => {
      const candidates = [
        ...document.querySelectorAll('textarea, [contenteditable="true"], [role="textbox"]')
      ];
      return candidates.map(el => ({
        tag: el.tagName,
        id: el.id || '',
        classes: el.className.toString().slice(0, 80),
        placeholder: el.getAttribute('placeholder') || '',
        visible: el.offsetHeight > 0 && el.offsetWidth > 0,
        role: el.getAttribute('role') || ''
      }));
    });
    if (results.length === 0) {
      console.log('  No textarea/contenteditable/textbox found.');
    }
    results.forEach(r =>
      console.log(`  <${r.tag.toLowerCase()}> id="${r.id}" class="${r.classes}" placeholder="${r.placeholder}" visible=${r.visible} role="${r.role}"`)
    );
  };

  // --- Claude ---
  let page = await context.newPage();
  await page.goto('https://claude.ai/new', { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForTimeout(4000);
  await probeInputs(page, 'Claude (may be on login page)');
  await page.close();

  // --- Perplexity ---
  page = await context.newPage();
  await page.goto('https://www.perplexity.ai/', { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForTimeout(4000);
  await probeInputs(page, 'Perplexity');
  await page.close();

  await browser.close();
  console.log('\nDone.');
})();
