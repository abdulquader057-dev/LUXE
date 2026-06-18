import { test, expect } from '@playwright/test';

test.describe('LUXE E2E E-Commerce Verification', () => {
  test('should mount home page and show Luxe branding', async ({ page }) => {
    // Go to homepage
    await page.goto('/');

    // Check that title or page text includes LUXE
    await expect(page).toHaveTitle(/LUXE/i);
  });

  test('should navigate to AI Suite and verify offline scanner UI', async ({ page }) => {
    await page.goto('/ar-scanner');
    
    // Check for AI Suite page title
    const header = page.locator('h1');
    await expect(header).toContainText(/LUXE AI Suite/i);
    
    // Check that camera offline message is visible since there is no native webcam on automated CI
    const cameraText = page.locator('text=Camera Offline or Denied');
    await expect(cameraText).toBeVisible();
  });

  test('should load AI Stylist page and render Zyra chat interface', async ({ page }) => {
    await page.goto('/ai-style');
    
    // Check for Zyra chat intro text or elements
    const zyraIntro = page.locator('text=AI Stylist');
    await expect(zyraIntro).toBeVisible();
  });
});
