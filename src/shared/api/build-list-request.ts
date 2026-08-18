import type { AuctionListRequest } from './contract'

/**
 * Строит тело `POST /auctions/list` из объекта фильтров: опускает неустановленные
 * значения (`undefined`/`null`), пустые строки и пустые массивы. Массивы и даты
 * (уже ISO-строки) сохраняются как есть. Пагинация (`page`/`per_page`) проходит
 * как обычные поля.
 */
export function buildAuctionListRequest(
  input: AuctionListRequest,
): AuctionListRequest {
  const out: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(input)) {
    if (value === undefined || value === null) continue
    if (typeof value === 'string' && value.trim() === '') continue
    if (Array.isArray(value) && value.length === 0) continue
    out[key] = value
  }

  return out as AuctionListRequest
}
