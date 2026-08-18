import { useMutation, useQueryClient } from '@tanstack/react-query'
import { setBet } from '@shared/api'

/**
 * Bid mutation. On success invalidates the list, detail and bets queries so
 * the updated price / trading status / bets are refetched. The detail key
 * prefix `['auction', uuid]` also matches the bets key `['auction', uuid, 'bets']`.
 */
export function usePlaceBet(auctionUuid: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (price: number) => setBet(auctionUuid, { price }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auctions'] })
      queryClient.invalidateQueries({ queryKey: ['auction', auctionUuid] })
    },
  })
}
