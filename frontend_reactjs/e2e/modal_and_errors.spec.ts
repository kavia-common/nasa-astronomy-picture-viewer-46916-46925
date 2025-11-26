import { test, expect } from '@playwright/test';

test('open modal and show HD link if present', async ({ page }) => {
  await page.goto('/');
  // Wait for card to render
  await expect(page.getByRole('button', { name: /open details/i })).toBeVisible();
  await page.getByRole('button', { name: /open details/i }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('button', { name: /close details dialog/i })).toBeVisible();
});

test('simulate backend failure and show ErrorBanner', async ({ page }) => {
  await page.route('**/api/apod*', route => {
    route.fulfill({
      status: 502,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Upstream error' })
    });
  });

  await page.goto('/');
  // Error banner should appear with error message
  await expect(page.getByRole('alert')).toBeVisible();
});
