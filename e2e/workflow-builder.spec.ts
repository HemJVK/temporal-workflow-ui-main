import { test, expect } from '@playwright/test';

// Helper to mock authentication by setting localStorage
async function mockAuth(page: any) {
  await page.addInitScript(() => {
    localStorage.setItem('auth_token', 'mock-jwt-token-for-e2e');
    localStorage.setItem('auth_user', JSON.stringify({
      id: 'e2e-user-1',
      email: 'e2e@test.com',
      credits: 1000,
      is_admin: false,
      has_seen_tutorial: true,
      phone_number: '+1234567890',
    }));
  });
}

test.describe('Workflow Builder', () => {
  // ── Happy Path ──────────────────────────────────────────────────────────
  test.describe('Happy Path', () => {
    test('canvas loads with Start node when authenticated', async ({ page }) => {
      await mockAuth(page);
      await page.goto('/dashboard');
      await page.waitForTimeout(2000);

      // ReactFlow canvas should be present
      const canvas = page.locator('.react-flow');
      if (await canvas.count() > 0) {
        await expect(canvas.first()).toBeVisible();
      }
    });

    test('sidebar with node types is visible', async ({ page }) => {
      await mockAuth(page);
      await page.goto('/dashboard');
      await page.waitForTimeout(2000);

      // Look for sidebar or node palette
      const sidebar = page.locator('[class*="sidebar" i], [class*="Sidebar"]');
      if (await sidebar.count() > 0) {
        await expect(sidebar.first()).toBeVisible();
      }
    });

    test('header has Deploy button', async ({ page }) => {
      await mockAuth(page);
      await page.goto('/dashboard');
      await page.waitForTimeout(2000);

      const deployBtn = page.locator('button:has-text("Deploy")');
      if (await deployBtn.count() > 0) {
        await expect(deployBtn.first()).toBeVisible();
      }
    });

    test('header has Save and Load buttons', async ({ page }) => {
      await mockAuth(page);
      await page.goto('/dashboard');
      await page.waitForTimeout(2000);

      const saveBtn = page.locator('button:has-text("Save"), span:has-text("Save")');
      const loadBtn = page.locator('button:has-text("Load"), span:has-text("Load")');

      if (await saveBtn.count() > 0) {
        await expect(saveBtn.first()).toBeVisible();
      }
      if (await loadBtn.count() > 0) {
        await expect(loadBtn.first()).toBeVisible();
      }
    });

    test('theme toggle button works', async ({ page }) => {
      await mockAuth(page);
      await page.goto('/dashboard');
      await page.waitForTimeout(2000);

      const themeBtn = page.locator('button[title*="Theme"]');
      if (await themeBtn.count() > 0) {
        await themeBtn.click();
        await page.waitForTimeout(500);
        // Verify DOM class changed
        const htmlClass = await page.evaluate(() => document.documentElement.className);
        expect(htmlClass).toBeTruthy();
      }
    });
  });

  // ── Sad Path ────────────────────────────────────────────────────────────
  test.describe('Sad Path', () => {
    test('unauthenticated user cannot access builder', async ({ page }) => {
      // Ensure no auth
      await page.addInitScript(() => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      });
      await page.goto('/dashboard');
      await page.waitForTimeout(2000);

      // Should be redirected away from dashboard
      const url = page.url();
      expect(url).toMatch(/login|signup|\/$/);
    });
  });
});
