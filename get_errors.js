const puppeteer = require('puppeteer');

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('BROWSER CONSOLE ERROR:', msg.text());
    }
  });

  page.on('pageerror', err => {
    console.log('BROWSER UNCAUGHT EXCEPTION:', err.toString());
  });

  console.log('Navigating to Vercel deployment...');
  await page.goto('https://luxe-kgxq.vercel.app', { waitUntil: 'networkidle0' });
  
  console.log('Page loaded. Waiting 2 seconds for any delayed crashes...');
  await new Promise(r => setTimeout(r, 2000));
  
  await browser.close();
  console.log('Done.');
})();
