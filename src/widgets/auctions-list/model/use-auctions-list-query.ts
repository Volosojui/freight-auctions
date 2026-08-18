import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { getAuction, listAuctions } from '@shared/api'
import { searchToListRequest, type FiltersSearch } from '@shared/lib/search'

/** Query for the auctions list. Key derives from the validated search params. */
export function useAuctionsListQuery(search: FiltersSearch) {
  return useQuery({
    queryKey: ['auctions', search],
    queryFn: ({ signal }) => listAuctions(searchToListRequest(search), signal),
    placeholderData: keepPreviousData,
  })
}

/**
 * Returns a prefetch callback for the auction detail. Uses the shared detail
 * key `['auction', uuid]` so navigation to the detail page hits a warm cache.
 */
export function usePrefetchAuction() {
  const queryClient = useQueryClient()
  return (uuid: string) => {
    void queryClient.prefetchQuery({
      queryKey: ['auction', uuid],
      queryFn: ({ signal }) => getAuction(uuid, signal),
    })
  }
}
