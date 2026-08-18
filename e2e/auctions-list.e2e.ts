import { test, expect } from '@playwright/test'

// Acceptance e2e for the auctions-list change: real browser against dev + MSW.

test('renders the seeded list', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByTestId('auctions-list')).toBeVisible()
  expect(await page.getByTestId('auction-card').count()).toBeGreaterThan(1)
})

test('applying a filter updates the URL and narrows results', async ({
  page,
}) => {
  await page.goto('/')
  await expect(page.getByTestId('auctions-list')).toBeVisible()

  await page.getByPlaceholder('00000001001').fill('00000001003')
  await page.getByRole('button', { name: 'Применить' }).click()

  await expect(page).toHaveURL(/cargo_num=00000001003/)
  await expect(page.getByTestId('auction-card')).toHaveCount(1)
})

test('navigates from the list to the detail route (prefetch on intent)', async ({
  page,
}) => {
  await page.goto('/')
  const firstCard = page.getByTestId('auction-card').first()
  await expect(firstCard).toBeVisible()

  // Hover triggers detail prefetch; then follow the card link.
  await firstCard.hover()
  await firstCard.getByRole('link').first().click()

  await expect(page).toHaveURL(/\/auctions\/[^/]+/)
})
