import type {
  AuctionListItem,
  AuctionShowResponse,
  BetItem,
} from '../contract'

/** Запись аукциона в мок-store: представления для списка, детальной и ставки. */
export interface MockAuction {
  /** Идентификатор из маршрутов (`/auctions/{auctionUuid}`) — равен order_uid. */
  uuid: string
  listItem: AuctionListItem
  detail: AuctionShowResponse
  bets: BetItem[]
}
