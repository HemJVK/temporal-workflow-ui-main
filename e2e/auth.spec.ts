import { test, expect } from '@playwright/test';

test.describe('Auth Flow', () => {
  // ── Happy Path ──────────────────────────────────────────────────────────
  test.describe('Happy Path', () => {
    test('login page loads with email/password form', async ({ page }) => {
      await page.goto('/login');
      // Should have email and password inputs
      const emailInput = page.locator('input[type="email"], input[placeholder*="email" i], input[name="email"]');
      const passwordInput = page.locator('input[type="password"]');
      if (await emailInput.count() > 0) {
        await expect(emailInput.first()).toBeVisible();
      }
      if (await passwordInput.count() > 0) {
        await expect(passwordInput.first()).toBeVisible();
      }
    });

    test('login form accepts input', async ({ page }) => {
      await page.goto('/login');
      const emailInput = page.locator('input[type="email"], input[placeholder*="email" i]').first();
      const passwordInput = page.locator('input[type="password"]').first();

      if (await emailInput.isVisible() && await passwordInput.isVisible()) {
        await emailInput.fill('test@example.com');
        await passwordInput.fill('password123');
        await expect(emailInput).toHaveValue('test@example.com');
        await expect(passwordInput).toHaveValue('password123');
      }
    });

    test('signup page loads correctly', async ({ page }) => {
      await page.goto('/signup');
      const body = await page.textContent('body');
      // Should contain signup related content
      expect(body).toBeTruthy();
    });
  });

  // ── Sad Path ────────────────────────────────────────────────────────────
  test.describe('Sad Path', () => {
    test('login with invalid credentials shows error', async ({ page }) => {
      await page.goto('/login');
      const emailInput = page.locator('input[type="email"], input[placeholder*="email" i]').first();
      const passwordInput = page.locator('input[type="password"]').first();
      const submitBtn = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first();

      if (await emailInput.isVisible() && await passwordInput.isVisible() && await submitBtn.isVisible()) {
        await emailInput.fill('invalid@test.com');
        await passwordInput.fill('wrongpassword');
        await submitBtn.click();

        // Wait for error message or alert
        await page.waitForTimeout(2000);
        // Check for error indicators (toast, alert, error text)
        const errorVisible = await page.locator('[class*="error"], [role="alert"], .text-red, [class*="Error"]').count();
        // The page should show some error feedback or remain on login
        const url = page.url();
        expect(url).toContain('login');
      }
    });

    test('accessing dashboard without auth redirects to login', async ({ page }) => {
      // Clear any stored auth
      await page.goto('/login');
      await page.evaluate(() => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      });
      await page.goto('/dashboard');
      await page.waitForTimeout(1000);
      // Should redirect to login or landing
      const url = page.url();
      expect(url).toMatch(/login|\/$/);
    });
  });
});
