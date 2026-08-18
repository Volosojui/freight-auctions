import { test, expect } from '@playwright/test'

// Acceptance for the theme switch (ui-redesign).

test('theme toggle switches and persists across reload', async ({ page }) => {
  await page.goto('/')
  const html = page.locator('html')

  const before = await html.getAttribute('data-theme')
  await page.getByTestId('theme-toggle').click()
  const after = await html.getAttribute('data-theme')

  expect(after).not.toBe(before)
  expect(['light', 'dark']).toContain(after)

  await page.reload()
  await expect(html).toHaveAttribute('data-theme', after!)
})

test('key screens render in dark theme', async ({ page }) => {
  await page.goto('/auctions/auc-0001')
  // Force dark and verify the detail still renders its sections.
  await page.evaluate(() => localStorage.setItem('theme', 'dark'))
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await expect(page.getByRole('heading', { name: 'Основное' })).toBeVisible()
})
