import { test, expect } from '@playwright/test';

test('open Today and see APOD title', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: /today/i })).toBeVisible();
  // Using backend shim, title will be "Dummy APOD"
  await expect(page.getByText(/apod/i)).toBeVisible();
});
