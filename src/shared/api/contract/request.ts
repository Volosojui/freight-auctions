import { z } from 'zod'

const sortDirectionSchema = z.enum(['asc', 'desc'])

/**
 * Тело запроса `POST /auctions/list`: фильтры и параметры пагинации.
 * Все поля опциональны — фильтр отправляется, только если задан.
 */
export const auctionListRequestSchema = z.object({
  page: z.number().int().optional(),
  per_page: z.number().int().optional(),
  is_oldest: z.boolean().nullable().optional(),
  sort: z.record(sortDirectionSchema).nullable().optional(),

  status: z.array(z.string()).optional(),
  mobile_statuses: z.array(z.number().int()).optional(),
  statuses: z.array(z.number().int()).optional(),

  cargo_num: z.string().optional(),
  weight_from: z.number().optional(),
  weight_to: z.number().optional(),
  volume_from: z.number().optional(),
  volume_to: z.number().optional(),
  body_types: z.array(z.string()).optional(),
  form_type: z.string().nullable().optional(),
  is_international_shipment: z.boolean().optional(),

  load_city: z.string().optional(),
  load_gc_id: z.number().int().optional(),
  load_range: z.number().int().optional(),
  unload_city: z.string().optional(),
  unload_gc_id: z.number().int().optional(),
  unload_range: z.number().int().optional(),

  load_date_from: z.string().optional(),
  load_date_to: z.string().optional(),
  unload_date_from: z.string().optional(),
  unload_date_to: z.string().optional(),
  create_date_from: z.string().optional(),
  create_date_to: z.string().optional(),
  start_time_from: z.string().optional(),
  start_time_to: z.string().optional(),
  stop_time_from: z.string().optional(),
  stop_time_to: z.string().optional(),

  is_available: z.boolean().optional(),
  is_favorite: z.boolean().optional(),
  is_bidder: z.boolean().optional(),

  customer: z.string().optional(),
  customer_ids: z.array(z.number().int()).optional(),
  contractor: z.string().nullable().optional(),
  auction_ids: z.array(z.number().int()).optional(),
  replace_external_pads: z.boolean().nullable().optional(),

  current_price_from: z.number().nullable().optional(),
  current_price_to: z.number().nullable().optional(),
  price_per_km_from: z.number().nullable().optional(),
  price_per_km_to: z.number().nullable().optional(),

  auc_type: z.array(z.string()).optional(),
})
export type AuctionListRequest = z.infer<typeof auctionListRequestSchema>

/** Тело запроса `POST /auctions/{auctionUuid}/bets`. */
export const setBetRequestSchema = z.object({
  price: z.number().positive(),
})
export type SetBetRequest = z.infer<typeof setBetRequestSchema>
