import { test, expect } from '@playwright/test'

// Acceptance for place-bet: the full end-to-end bidding path.

test('places a bid and sees the state update', async ({ page }) => {
  await page.goto('/auctions/auc-0001')

  // Open the addressable bid form from the detail action.
  await page.getByTestId('bid-action').click()
  await expect(page).toHaveURL(/bid=/)

  await page.getByTestId('bet-price').fill('50000')
  await page.getByTestId('bet-submit').click()

  // Success toast, form closes.
  await expect(page.getByText('Ставка принята')).toBeVisible()
  await expect(page.getByTestId('bet-price')).toHaveCount(0)

  // The bets tab now reflects our new bid (participant added).
  await page.getByTestId('tab-bets').click()
  await expect(page.getByTestId('bets-participants')).toContainText('3')
  await expect(page.getByText('ООО Наша Компания')).toBeVisible()
})

test('opens the bid form directly from a deep link', async ({ page }) => {
  await page.goto('/auctions/auc-0001?bid=1')
  await expect(page.getByTestId('bet-price')).toBeVisible()
})

test('does not open a bid form when bidding is disabled', async ({ page }) => {
  await page.goto('/auctions/auc-0004')
  await expect(page.getByTestId('bid-action')).toBeDisabled()
})
