import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { App } from '@app/index'

test('app shell монтируется и рендерит layout', async () => {
  render(<App />)

  // RouterProvider монтируется асинхронно — ждём появления шапки app shell.
  expect(
    await screen.findByRole('link', { name: 'Грузовые аукционы' }),
  ).toBeInTheDocument()

  // Индексный маршрут отрисовался внутри контентной области —
  // значит RouterProvider и QueryClientProvider смонтировались без ошибок.
  expect(await screen.findByText('Аукционы')).toBeInTheDocument()
})
