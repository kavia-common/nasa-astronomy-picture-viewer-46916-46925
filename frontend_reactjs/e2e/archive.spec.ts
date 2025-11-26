import { test, expect } from '@playwright/test';

test('navigate to Archive and pick date', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /archive/i }).click();
  await expect(page.getByRole('heading', { level: 1, name: /archive/i })).toBeVisible();

  // Select a date; relies on native date input support
  const input = page.getByLabel('APOD date selector');
  await input.fill('2024-01-10');
  // The UI shows a card with the selected date somewhere
  await expect(page.getByText(/2024-01-10/)).toBeVisible();
});
