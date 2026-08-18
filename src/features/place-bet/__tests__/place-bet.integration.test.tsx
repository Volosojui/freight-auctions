import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { API_BASE_URL } from '@shared/api'
import { server } from '@shared/api/mock/server'
import { getStore, resetStore } from '@shared/api/mock/store'
import { toastStore } from '@shared/ui'
import { PlaceBetModal } from '../ui/place-bet-modal.component'

beforeEach(() => {
  resetStore()
  toastStore.clear()
})

function renderModal(uuid: string, onClose = vi.fn()) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  render(
    <QueryClientProvider client={client}>
      <PlaceBetModal auctionUuid={uuid} onClose={onClose} />
    </QueryClientProvider>,
  )
  return { onClose }
}

describe('PlaceBetModal — availability & validation', () => {
  it('shows the form and a price/step hint when bidding is allowed', async () => {
    renderModal('auc-0001')
    expect(await screen.findByTestId('bet-price')).toBeInTheDocument()
    expect(screen.getByTestId('bet-hint')).toHaveTextContent('Шаг')
  })

  it('shows an unavailable state when can_set_bet is false', async () => {
    renderModal('auc-0004')
    expect(await screen.findByTestId('place-bet-unavailable')).toBeInTheDocument()
  })

  it('rejects an empty price on the client', async () => {
    const user = userEvent.setup()
    const { onClose } = renderModal('auc-0001')
    await screen.findByTestId('bet-price')
    await user.click(screen.getByTestId('bet-submit'))
    expect(await screen.findByTestId('bet-price-error')).toBeInTheDocument()
    expect(onClose).not.toHaveBeenCalled()
  })

  it('rejects an out-of-range price on the client', async () => {
    const user = userEvent.setup()
    renderModal('auc-0001')
    await screen.findByTestId('bet-price')
    await user.type(screen.getByTestId('bet-price'), '39000') // below min 40000
    await user.click(screen.getByTestId('bet-submit'))
    expect(await screen.findByTestId('bet-price-error')).toBeInTheDocument()
  })
})

describe('PlaceBetModal — server errors', () => {
  it('maps a 422 field error back onto the price field + error toast', async () => {
    server.use(
      http.post(`${API_BASE_URL}/auctions/:auctionUuid/bets`, () =>
        HttpResponse.json(
          {
            code: 'validation_failed',
            title: 'Ошибка валидации',
            message: 'Некорректные поля.',
            errors: [{ field: 'price', message: 'Слишком низкая цена' }],
          },
          { status: 422 },
        ),
      ),
    )
    const user = userEvent.setup()
    renderModal('auc-0001')
    await screen.findByTestId('bet-price')
    await user.type(screen.getByTestId('bet-price'), '54000')
    await user.click(screen.getByTestId('bet-submit'))

    expect(await screen.findByTestId('bet-price-error')).toHaveTextContent(
      'Слишком низкая цена',
    )
    expect(toastStore.toasts.some((t) => t.kind === 'error')).toBe(true)
  })

  it('shows an error toast on a non-validation server failure', async () => {
    server.use(
      http.post(`${API_BASE_URL}/auctions/:auctionUuid/bets`, () =>
        HttpResponse.json(
          { code: 'service_unavailable', title: 'x', message: 'Сервис недоступен' },
          { status: 503 },
        ),
      ),
    )
    const user = userEvent.setup()
    renderModal('auc-0001')
    await screen.findByTestId('bet-price')
    await user.type(screen.getByTestId('bet-price'), '54000')
    await user.click(screen.getByTestId('bet-submit'))
    await waitFor(() =>
      expect(toastStore.toasts.some((t) => t.kind === 'error')).toBe(true),
    )
  })
})

describe('PlaceBetModal — accessibility', () => {
  it('moves focus to the price input on open (focus stays inside)', async () => {
    renderModal('auc-0001')
    const input = await screen.findByTestId('bet-price')
    await waitFor(() => expect(input).toHaveFocus())
  })

  it('closes on Escape', async () => {
    const { onClose } = renderModal('auc-0001')
    await screen.findByTestId('bet-price')
    fireEvent.keyDown(document, { key: 'Escape' })
    await waitFor(() => expect(onClose).toHaveBeenCalled())
  })
})

describe('PlaceBetModal — success', () => {
  it('places a bid: success toast, closes, and the store reflects the new state', async () => {
    const user = userEvent.setup()
    const { onClose } = renderModal('auc-0001')
    await screen.findByTestId('bet-price')
    await user.type(screen.getByTestId('bet-price'), '50000')
    await user.click(screen.getByTestId('bet-submit'))

    await waitFor(() => expect(onClose).toHaveBeenCalled())
    expect(toastStore.toasts.some((t) => t.kind === 'success')).toBe(true)

    const auction = getStore().byUuid.get('auc-0001')!
    expect(auction.detail.trading.price.current).toBe(50000)
    expect(auction.detail.trading.your.bet).toBe(true)
    expect(auction.detail.trading.status_mobile).toBe('Leading')
  })
})
