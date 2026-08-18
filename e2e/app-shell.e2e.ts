import { test, expect } from '@playwright/test'

// Приёмка bootstrap-app / app-shell — сквозные сценарии в реальном браузере.

test('app shell загружается и рендерит layout', async ({ page }) => {
  await page.goto('/')
  await expect(
    page.getByRole('link', { name: 'Грузовые аукционы' }),
  ).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Аукционы' })).toBeVisible()
})

test('неизвестный маршрут показывает состояние not-found', async ({ page }) => {
  await page.goto('/no-such-route')
  await expect(
    page.getByRole('heading', { name: 'Страница не найдена' }),
  ).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Вернуться к списку' }),
  ).toBeVisible()
})

test('маршрут детальной принимает параметр auctionUuid', async ({ page }) => {
  await page.goto('/auctions/auc-0001')
  await expect(page.getByText('auc-0001')).toBeVisible()
})

test('навигация без полной перезагрузки', async ({ page }) => {
  await page.goto('/')
  // помечаем окно; при SPA-навигации маркер сохраняется
  await page.evaluate(() => ((window as { __spa?: boolean }).__spa = true))
  await page.getByRole('link', { name: 'Грузовые аукционы' }).click()
  await expect(page).toHaveURL('http://localhost:5173/')
  const survived = await page.evaluate(
    () => (window as { __spa?: boolean }).__spa === true,
  )
  expect(survived).toBe(true)
})
