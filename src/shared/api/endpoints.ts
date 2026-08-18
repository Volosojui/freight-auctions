import {
  auctionListResponseSchema,
  auctionShowResponseSchema,
  betListResponseSchema,
  type AuctionListRequest,
  type AuctionListResponse,
  type AuctionShowResponse,
  type BetListResponse,
  type SetBetRequest,
} from './contract'
import { apiFetch } from './http-client'
import { buildAuctionListRequest } from './build-list-request'

/** `POST /auctions/list` — список аукционов с пагинацией и фильтрами. */
export async function listAuctions(
  filters: AuctionListRequest,
  signal?: AbortSignal,
): Promise<AuctionListResponse> {
  const body = buildAuctionListRequest(filters)
  const raw = await apiFetch('/auctions/list', { method: 'POST', body, signal })
  return auctionListResponseSchema.parse(raw)
}

/** `GET /auctions/{auctionUuid}` — детальная информация об аукционе. */
export async function getAuction(
  auctionUuid: string,
  signal?: AbortSignal,
): Promise<AuctionShowResponse> {
  const raw = await apiFetch(`/auctions/${encodeURIComponent(auctionUuid)}`, {
    signal,
  })
  return auctionShowResponseSchema.parse(raw)
}

/** `GET /auctions/{auctionUuid}/bets` — список ставок аукциона. */
export async function listBets(
  auctionUuid: string,
  signal?: AbortSignal,
): Promise<BetListResponse> {
  const raw = await apiFetch(
    `/auctions/${encodeURIComponent(auctionUuid)}/bets`,
    { signal },
  )
  return betListResponseSchema.parse(raw)
}

/** `POST /auctions/{auctionUuid}/bets` — установить ставку. */
export async function setBet(
  auctionUuid: string,
  body: SetBetRequest,
  signal?: AbortSignal,
): Promise<unknown> {
  return apiFetch(`/auctions/${encodeURIComponent(auctionUuid)}/bets`, {
    method: 'POST',
    body,
    signal,
  })
}
