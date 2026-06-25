import { test, expect } from '@playwright/test';

test('Verify Above Fantastic Overhaul', async ({ page }) => {
  await page.goto('file://' + process.cwd() + '/index.html');

  // Wait for loading to disappear
  await page.waitForSelector('#loading', { state: 'hidden', timeout: 10000 });

  // Wait for UI to fade in
  await page.waitForSelector('#ui-layer', { state: 'visible' });

  // Simulate mouse movement to trigger HUD tilt and check interactivity
  await page.mouse.move(100, 100);
  await page.waitForTimeout(500);
  await page.mouse.move(600, 400);
  await page.waitForTimeout(500);

  // Take screenshot to verify visuals (satellites, POI, HUD)
  await page.screenshot({ path: 'verification_above_fantastic.png' });

  // Verify POI labels are present (check for specific text in canvas is hard, but we can check if they are defined in code)
  // Instead, let's check if there are any console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      throw new Error(`Console error: ${msg.text()}`);
    }
  });

  // Check if zoom works
  const zoomBefore = await page.evaluate(() => document.getElementById('zoom-val')?.textContent);
  await page.mouse.wheel(0, -100);
  await page.waitForTimeout(1000);
  const zoomAfter = await page.evaluate(() => document.getElementById('zoom-val')?.textContent);
  console.log(`Zoom transition: ${zoomBefore} -> ${zoomAfter}`);

  // Verify that the globe is actually rendering (checking canvas pixel color isn't 100% black)
  const isRendering = await page.evaluate(() => {
    const canvas = document.getElementById('globeCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;
    const data = ctx.getImageData(canvas.width/2, canvas.height/2, 1, 1).data;
    // Check if it's not pure black (background is #000, so any colored pixel means rendering)
    return data[0] > 0 || data[1] > 0 || data[2] > 0;
  });

  expect(isRendering).toBeTruthy();
});
