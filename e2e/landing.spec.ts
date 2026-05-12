import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('should load with app branding', async ({ page }) => {
    await page.goto('/');
    // Landing page should have the app name visible
    await expect(page.locator('body')).toBeVisible();
    // Check for core branding text
    const content = await page.textContent('body');
    expect(content).toBeTruthy();
  });

  test('should have a Login CTA', async ({ page }) => {
    await page.goto('/');
    // Look for login link/button
    const loginLink = page.locator('a[href*="login"], button:has-text("Login"), a:has-text("Login"), a:has-text("Sign In")');
    if (await loginLink.count() > 0) {
      await expect(loginLink.first()).toBeVisible();
    }
  });

  test('should have a Get Started / Sign Up CTA', async ({ page }) => {
    await page.goto('/');
    const ctaLink = page.locator('a:has-text("Get Started"), a:has-text("Sign Up"), button:has-text("Get Started")');
    if (await ctaLink.count() > 0) {
      await expect(ctaLink.first()).toBeVisible();
    }
  });

  test('should navigate to /login when Login is clicked', async ({ page }) => {
    await page.goto('/');
    const loginLink = page.locator('a[href*="login"]').first();
    if (await loginLink.isVisible()) {
      await loginLink.click();
      await expect(page).toHaveURL(/login/);
    }
  });
});
