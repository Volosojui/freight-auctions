import { render, screen, fireEvent } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import { describe, expect, it } from 'vitest'
import { BetsList } from '@widgets/bets-list'
import { AuctionDetailPage } from '../ui/auction-detail-page.component'

function newClient() {
  return new QueryClient({ defaultOptions: { queries: { retry: false } } })
}

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
  render(
    <QueryClientProvider client={newClient()}>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <RouterProvider router={router as any} />
    </QueryClientProvider>,
  )
}

describe('AuctionDetailPage — bets tab', () => {
  it('lists bets with carrier, prices, rejected reason and participant count', async () => {
    renderDetail('auc-0001')
    fireEvent.click(await screen.findByTestId('tab-bets'))

    const rows = await screen.findAllByTestId('bet-row')
    expect(rows).toHaveLength(3)
    expect(screen.getByTestId('bets-participants')).toHaveTextContent(
      'Участников: 2',
    )
    expect(screen.getByText('ООО Перевозчик-1')).toBeInTheDocument()
    expect(screen.getByText(/Не прошёл аккредитацию/)).toBeInTheDocument()
  })

  it('highlights the winning bet', async () => {
    renderDetail('auc-0006')
    fireEvent.click(await screen.findByTestId('tab-bets'))
    expect(await screen.findByText('Победитель')).toBeInTheDocument()
  })

  it('shows an empty state when there are no bets', async () => {
    renderDetail('auc-0003')
    fireEvent.click(await screen.findByTestId('tab-bets'))
    expect(await screen.findByTestId('bets-empty')).toBeInTheDocument()
  })

  it('disables the bets tab when history is hidden', async () => {
    renderDetail('auc-0005')
    expect(await screen.findByTestId('tab-bets')).toBeDisabled()
  })
})

describe('BetsList — hidden history', () => {
  it('renders a hidden-history state when canView is false', () => {
    render(
      <QueryClientProvider client={newClient()}>
        <BetsList auctionUuid="auc-0005" canView={false} />
      </QueryClientProvider>,
    )
    expect(screen.getByTestId('bets-hidden')).toBeInTheDocument()
  })
})
