import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { getAuction, type AuctionShowResponse } from '@shared/api'

/**
 * Query key for a single auction's detail. Shared contract: the list page's
 * intent-prefetch uses the exact same key so navigation hits the cache.
 */
export const auctionDetailKey = (auctionUuid: string) =>
  ['auction', auctionUuid] as const

/** Loads the auction detail via GET /auctions/{auctionUuid}. */
export function useAuctionDetailQuery(
  auctionUuid: string,
): UseQueryResult<AuctionShowResponse> {
  return useQuery({
    queryKey: auctionDetailKey(auctionUuid),
    queryFn: ({ signal }) => getAuction(auctionUuid, signal),
  })
}
