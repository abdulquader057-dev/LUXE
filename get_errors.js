/* eslint-disable @typescript-eslint/no-require-imports */
const puppeteer = require('puppeteer');

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`[${page.url()}] BROWSER CONSOLE ERROR:`, msg.text());
    }
  });

  page.on('pageerror', err => {
    console.log(`[${page.url()}] BROWSER UNCAUGHT EXCEPTION:`, err.toString());
  });

  const routes = [
    '/',
    '/shop',
    '/ai-style',
    '/ar-scanner',
    '/build-outfit',
    '/drops',
    '/swipe',
    '/profile'
  ];

  for (const route of routes) {
    const url = `https://luxe-kgxq.vercel.app${route}`;
    console.log(`Navigating to ${url}...`);
    try {
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 });
      await new Promise(r => setTimeout(r, 1500));
    } catch (e) {
      console.log(`Error navigating to ${url}:`, e.message);
    }
  }
  
  await browser.close();
  console.log('Done.');
})();
