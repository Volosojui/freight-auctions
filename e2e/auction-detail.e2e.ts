import { test, expect } from '@playwright/test'

// Acceptance for auction-detail. The list page is still a stub on this branch,
// so detail routes are opened directly by URL against the dev server + MSW.

test('opens an existing auction and renders sections', async ({ page }) => {
  await page.goto('/auctions/auc-0001')
  await expect(page.getByRole('heading', { name: 'Основное' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Цены и торги' })).toBeVisible()
  await expect(page.getByText('Ваша ставка')).toBeVisible()
  await expect(page.getByTestId('bid-action')).toBeEnabled()
})

test('hides contacts and cargo price when the DTO flags are set', async ({
  page,
}) => {
  await page.goto('/auctions/auc-0006')
  await expect(page.getByText('Контакты скрыты организатором.')).toBeVisible()
  await expect(page.getByText('Адрес скрыт').first()).toBeVisible()
  await expect(page.getByText('Цена груза')).toHaveCount(0)
})

test('disables the bid action when can_set_bet is false', async ({ page }) => {
  await page.goto('/auctions/auc-0004')
  await expect(page.getByTestId('bid-action')).toBeDisabled()
})

test('shows a not-found state for an unknown auction', async ({ page }) => {
  await page.goto('/auctions/does-not-exist')
  await expect(page.getByTestId('detail-not-found')).toBeVisible()
})
