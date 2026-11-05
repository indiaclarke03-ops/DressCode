// Regenerates public/og-image.png and docs/screenshot.png.
// Run `npm run build && npm run preview -- --port 4173` first, then `node scripts/make-og-image.mjs`.
import { chromium } from '@playwright/test';

const browser = await chromium.launch();

const og = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await og.setContent(`<!doctype html>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400&family=Geist+Mono&family=Instrument+Serif&display=swap" rel="stylesheet">
<body style="margin:0;width:1200px;height:630px;background:#F7F5F0;color:#1A1915;font-family:Geist,sans-serif;display:flex;flex-direction:column;justify-content:space-between;padding:72px;box-sizing:border-box">
  <div style="display:flex;align-items:center;gap:14px">
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#C2552D" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10 10.5 3.6 6.6A1 1 0 0 0 2 7.4v9.2a1 1 0 0 0 1.6.8l6.4-3.9"/><path d="m14 10.5 6.4-3.9a1 1 0 0 1 1.6.8v9.2a1 1 0 0 1-1.6.8L14 13.5"/><rect x="10" y="9.75" width="4" height="4.5" rx="1"/></svg>
    <span style="font-family:'Instrument Serif',serif;font-size:40px">Dress Code</span>
  </div>
  <div>
    <div style="font-family:'Instrument Serif',serif;font-size:112px;line-height:1;letter-spacing:-.015em;">Give your AI agent<br>a dress code.</div>
    <div style="margin-top:28px;font-size:30px;color:#6E6A60">Pick what you like. Get a brief your agent can follow.</div>
  </div>
  <div style="display:flex;height:14px;border-radius:7px;overflow:hidden;width:360px">
    <span style="flex:1;background:#C2552D"></span><span style="flex:1;background:#1F5C45"></span><span style="flex:1;background:#1F3A5F"></span><span style="flex:1;background:#A8701A"></span>
  </div>
</body>`, { waitUntil: 'networkidle' });
await og.evaluate(() => document.fonts.ready);
await og.screenshot({ path: 'public/og-image.png' });

const shot = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await shot.emulateMedia({ colorScheme: 'light' });
await shot.goto('http://localhost:4173/DressCode/');
await shot.evaluate(() => document.fonts.ready);
await shot.waitForTimeout(400);
await shot.screenshot({ path: 'docs/screenshot.png' });

await browser.close();
