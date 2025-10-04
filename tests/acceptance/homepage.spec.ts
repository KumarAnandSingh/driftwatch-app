import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load and display title', async ({ page }) => {
    await page.goto('/');

    // Check title
    await expect(page).toHaveTitle(/DriftWatch/);

    // Check main heading
    const heading = page.getByRole('heading', { name: /Unified quality report/i });
    await expect(heading).toBeVisible();
  });

  test('should have navigation links', async ({ page }) => {
    await page.goto('/');

    // Check main navigation in header
    const header = page.getByRole('banner');
    await expect(header.getByRole('link', { name: 'Features' })).toBeVisible();
    await expect(header.getByRole('link', { name: 'Demo' })).toBeVisible();
    await expect(header.getByRole('link', { name: 'Pricing' })).toBeVisible();
  });

  test('should have CTA buttons', async ({ page }) => {
    await page.goto('/');

    // Check hero section CTA buttons with unique accessible names
    await expect(page.getByRole('link', { name: /Try Live Demo - Interactive demonstration/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Sign up - Start your free trial/i })).toBeVisible();
  });
});
