import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { delay, http, HttpResponse } from 'msw'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  Outlet,
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import { API_BASE_URL } from '@shared/api'
import { filtersSearchSchema } from '@shared/lib/search'
import { resetStore } from '@shared/api/mock/store'
import { server } from '@shared/api/mock/server'
import { AuctionsListPage } from './ui/auctions-list-page.component'

beforeEach(() => resetStore())

function renderAt(entry: string) {
  const rootRoute = createRootRoute({ component: () => <Outlet /> })
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: AuctionsListPage,
    validateSearch: filtersSearchSchema,
  })
  const detailRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/auctions/$auctionUuid',
    component: () => <div>detail stub</div>,
  })
  const router = createRouter({
    routeTree: rootRoute.addChildren([indexRoute, detailRoute]),
    history: createMemoryHistory({ initialEntries: [entry] }),
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
  return router
}

describe('auctions list — states', () => {
  it('shows skeleton then the list from mocks', async () => {
    // Delay the response so the loading frame is observable.
    server.use(
      http.post(`${API_BASE_URL}/auctions/list`, async () => {
        await delay(50)
        return HttpResponse.json({
          data: [],
          meta: {
            current_page: 1,
            last_page: 1,
            per_page: 20,
            total: 0,
            from: 0,
            to: 0,
          },
        })
      }),
    )
    renderAt('/')
    expect(await screen.findByTestId('auctions-skeleton')).toBeInTheDocument()

    server.resetHandlers()
    renderAt('/')
    expect(await screen.findByTestId('auctions-list')).toBeInTheDocument()
    expect(screen.getAllByTestId('auction-card').length).toBeGreaterThan(0)
  })

  it('shows empty state when nothing matches', async () => {
    renderAt('/?cargo_num=НЕТ-ТАКОГО')
    expect(await screen.findByTestId('auctions-empty')).toBeInTheDocument()
  })

  it('shows error state with a retry action', async () => {
    server.use(
      http.post(`${API_BASE_URL}/auctions/list`, () =>
        HttpResponse.json({ code: 'boom', title: 'x', message: 'y' }, { status: 500 }),
      ),
    )
    renderAt('/')
    expect(await screen.findByTestId('auctions-error')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Повторить' })).toBeInTheDocument()
  })
})

describe('auctions list — filters and pagination', () => {
  it('restores filters and page from the URL', async () => {
    renderAt('/?cargo_num=00000001003')
    expect(await screen.findByTestId('auctions-list')).toBeInTheDocument()
    expect(screen.getAllByTestId('auction-card')).toHaveLength(1)
    expect(screen.getByPlaceholderText('00000001001')).toHaveValue('00000001003')
  })

  it('applying a filter updates the URL and refetches', async () => {
    const user = userEvent.setup()
    const router = renderAt('/')
    await screen.findByTestId('auctions-list')

    await user.type(screen.getByPlaceholderText('00000001001'), '00000001003')
    await user.click(screen.getByRole('button', { name: 'Применить' }))

    await waitFor(() =>
      expect(screen.getAllByTestId('auction-card')).toHaveLength(1),
    )
    expect(router.state.location.search).toMatchObject({
      cargo_num: '00000001003',
    })
    // clean URL: applying a filter returns to page 1 (page omitted)
    expect(router.state.location.search.page).toBeUndefined()
  })

  it('paginates via meta', async () => {
    const user = userEvent.setup()
    const router = renderAt('/?per_page=2')
    const info = await screen.findByTestId('pagination-info')
    expect(info).toHaveTextContent('Страница 1 из 3')

    await user.click(screen.getByRole('button', { name: /Вперёд/ }))

    await waitFor(() =>
      expect(screen.getByTestId('pagination-info')).toHaveTextContent(
        'Страница 2 из 3',
      ),
    )
    expect(router.state.location.search).toMatchObject({ page: 2 })
  })
})

describe('auctions list — card content', () => {
  it('renders contract fields and a state-appropriate primary action', async () => {
    renderAt('/?cargo_num=00000001003')
    await screen.findByTestId('auctions-list')
    const card = screen.getByTestId('auction-card')
    expect(card).toHaveTextContent('№ 00000001003')
    expect(card).toHaveTextContent('Екатеринбург')
    expect(card).toHaveTextContent('Новосибирск')
    // auc-0003: can_set_bet true, no own bet -> "Сделать ставку"
    expect(card).toHaveTextContent('Сделать ставку')
  })
})
