import { test, expect } from '@playwright/test'

// Acceptance for bets-view: the bets tab on the detail page.

test('opens the bets tab and lists bets with participant count', async ({
  page,
}) => {
  await page.goto('/auctions/auc-0001')
  await page.getByTestId('tab-bets').click()
  await expect(page.getByTestId('bets-participants')).toContainText('Участников')
  await expect(page.getByTestId('bet-row').first()).toBeVisible()
})

test('shows an empty state when the auction has no bets', async ({ page }) => {
  await page.goto('/auctions/auc-0003')
  await page.getByTestId('tab-bets').click()
  await expect(page.getByTestId('bets-empty')).toBeVisible()
})

test('disables the bets tab when history is hidden', async ({ page }) => {
  await page.goto('/auctions/auc-0005')
  await expect(page.getByTestId('tab-bets')).toBeDisabled()
})
