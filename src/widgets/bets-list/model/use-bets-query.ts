import { useQuery } from '@tanstack/react-query'
import { listBets } from '@shared/api'

/** Bets query key, nested under the detail key: ['auction', uuid, 'bets']. */
export const betsKey = (auctionUuid: string) =>
  ['auction', auctionUuid, 'bets'] as const

/**
 * Loads an auction's bets. Disabled unless `canView` — when the history is
 * hidden (`hide_bets_history`) we never hit the endpoint.
 */
export function useBetsQuery(auctionUuid: string, canView: boolean) {
  return useQuery({
    queryKey: betsKey(auctionUuid),
    queryFn: ({ signal }) => listBets(auctionUuid, signal),
    enabled: canView,
  })
}
