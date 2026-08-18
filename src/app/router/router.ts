import {
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import {
  AuctionsListPage,
  AuctionDetailPage,
  NotFoundPage,
} from '@pages/index'
import { filtersSearchSchema } from '@shared/lib/search'
import { RootLayout } from './root-layout.component'
import { RootErrorBoundary } from './root-error.component'

const rootRoute = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFoundPage,
  errorComponent: RootErrorBoundary,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: AuctionsListPage,
  validateSearch: filtersSearchSchema,
})

const auctionDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auctions/$auctionUuid',
  component: AuctionDetailPage,
  // `?bid=1` opens the addressable bid form over the detail page.
  validateSearch: (search: Record<string, unknown>): { bid?: true } => {
    const bid = search.bid
    return bid === true || bid === 'true' || bid === 1 || bid === '1'
      ? { bid: true }
      : {}
  },
})

const routeTree = rootRoute.addChildren([indexRoute, auctionDetailRoute])

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
})

// Регистрация типов роутера для типобезопасных ссылок/параметров.
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
