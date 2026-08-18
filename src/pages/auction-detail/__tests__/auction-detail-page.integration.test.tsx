import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import { delay, http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { API_BASE_URL } from '@shared/api'
import { server } from '@shared/api/mock/server'
import { getStore } from '@shared/api/mock/store'
import { AuctionDetailPage } from '../ui/auction-detail-page.component'

function renderDetail(uuid: string) {
  const rootRoute = createRootRoute()
  const detailRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/auctions/$auctionUuid',
    component: AuctionDetailPage,
  })
  const router = createRouter({
    routeTree: rootRoute.addChildren([detailRoute]),
    history: createMemoryHistory({ initialEntries: [`/auctions/${uuid}`] }),
  })
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  render(
    <QueryClientProvider client={queryClient}>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <RouterProvider router={router as any} />
    </QueryClientProvider>,
  )
}

describe('AuctionDetailPage — loading & sections', () => {
  it('shows a skeleton while loading', async () => {
    server.use(
      http.get(`${API_BASE_URL}/auctions/:auctionUuid`, async () => {
        await delay(60)
        return HttpResponse.json(getStore().byUuid.get('auc-0001')!.detail)
      }),
    )
    renderDetail('auc-0001')
    expect(await screen.findByTestId('detail-skeleton')).toBeInTheDocument()
    await screen.findByText('Основное')
  })

  it('renders all sections with prices and own-bid state', async () => {
    renderDetail('auc-0001')
    expect(await screen.findByText('Основное')).toBeInTheDocument()
    expect(screen.getByText('Организатор')).toBeInTheDocument()
    expect(screen.getByText('Маршрут')).toBeInTheDocument()
    expect(screen.getByText('Груз и требования к ТС')).toBeInTheDocument()
    expect(screen.getByText('Оплата')).toBeInTheDocument()
    expect(screen.getByText('Цены и торги')).toBeInTheDocument()
    expect(screen.getByText('Текущая цена')).toBeInTheDocument()
    expect(screen.getByText('Ваша ставка')).toBeInTheDocument()
  })

  it('renders a not-found state for an unknown auction (404)', async () => {
    renderDetail('does-not-exist')
    expect(await screen.findByTestId('detail-not-found')).toBeInTheDocument()
  })

  it('renders an error state on server failure', async () => {
    server.use(
      http.get(`${API_BASE_URL}/auctions/:auctionUuid`, () =>
        HttpResponse.json({ code: 'boom', title: 'x', message: 'y' }, { status: 500 }),
      ),
    )
    renderDetail('auc-0001')
    expect(await screen.findByTestId('detail-error')).toBeInTheDocument()
  })
})

describe('AuctionDetailPage — DTO restrictions', () => {
  it('hides contacts, addresses and cargo price when flagged', async () => {
    renderDetail('auc-0006')
    expect(
      await screen.findByText('Контакты скрыты организатором.'),
    ).toBeInTheDocument()
    expect(screen.getAllByText('Адрес скрыт').length).toBeGreaterThan(0)
    expect(screen.queryByText('Цена груза')).not.toBeInTheDocument()
  })

  it('disables the bets action and notes hidden history', async () => {
    renderDetail('auc-0005')
    expect(await screen.findByTestId('bets-action')).toBeDisabled()
    expect(screen.getByText('История ставок скрыта')).toBeInTheDocument()
  })

  it('disables the bid action when can_set_bet is false', async () => {
    renderDetail('auc-0004')
    expect(await screen.findByTestId('bid-action')).toBeDisabled()
  })

  it('enables the bid action when can_set_bet is true', async () => {
    renderDetail('auc-0001')
    expect(await screen.findByTestId('bid-action')).toBeEnabled()
  })
})
