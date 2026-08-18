import { z } from 'zod'
import {
  auctionStatusSchema,
  bidMeasurementTypeSchema,
  tradingStatusSchema,
} from './enums'
import { docsSchema, loadingTypesSchema } from './common'

export const auctionListItemMainSchema = z.object({
  id: z.number().int(),
  cargo_num: z.string(),
  cargo_date: z.string(),
  auc_type: z.string(),
  order_uid: z.string(),
  created_at: z.string(),
  priority_sort: z.number().int(),
  is_assembly: z.boolean(),
  price_per_km: z.number().nullable(),
})

export const auctionListItemOrganizerSchema = z.object({
  subscriber_id: z.number().int(),
  organization_id: z.number().int(),
  organization_name: z.string(),
  organization_inn: z.string(),
  organization_kpp: z.string(),
  is_hide_organization: z.boolean(),
})

export const auctionListItemRoutePointSchema = z.object({
  city: z.string(),
  address: z.string(),
  date: z.string(),
  city_gc_id: z.number().int(),
  points_count: z.number().int(),
})

export const auctionListItemRouteSchema = z.object({
  load: auctionListItemRoutePointSchema,
  unload: auctionListItemRoutePointSchema,
})

export const auctionListItemCargoCarSchema = z.object({
  type: z.string(),
  weight: z.number(),
  volume: z.number(),
  width: z.number(),
  length: z.number(),
  height: z.number(),
})

export const auctionListItemCargoSchema = z.object({
  name: z.string(),
  weight: z.number(),
  volume: z.number(),
  body_type: z.string(),
  truck_count: z.number().int(),
  is_cargo: z.boolean(),
  is_international: z.boolean(),
  containered: z.boolean(),
  incoterms: z.string(),
  conics: z.number().int(),
  belts: z.number().int(),
  adr: z.number().int(),
  coupling: z.boolean(),
  air_pass: z.boolean(),
  low_loader: z.boolean(),
  additional_load: z.boolean(),
  temp_from: z.number().int(),
  temp_to: z.number().int(),
  loading_types: loadingTypesSchema,
  docs: docsSchema,
  car: auctionListItemCargoCarSchema.nullable(),
})

export const auctionListItemPaymentSchema = z.object({
  form: z.string(),
  currency_code: z.string(),
  consignor: z.string(),
  consignee: z.string(),
})

export const auctionListItemTradingPriceSchema = z.object({
  start: z.number(),
  current: z.number(),
  current_no_vat: z.number(),
})

export const auctionListItemTradingYourSchema = z.object({
  bet: z.boolean(),
  last_bet: z.number().nullable(),
})

export const auctionListItemTradingSchema = z.object({
  status: auctionStatusSchema,
  status_mobile: tradingStatusSchema,
  start_time: z.string(),
  stop_time: z.string(),
  bid_measurement_type: bidMeasurementTypeSchema.nullable(),
  can_set_bet: z.boolean(),
  allow_counter_bets: z.boolean(),
  hide_points_address_and_contacts: z.boolean(),
  direction: z.string().nullable(),
  comment: z.string().nullable(),
  is_bidder: z.boolean(),
  is_available: z.boolean(),
  is_accredited: z.boolean(),
  is_favorite: z.boolean(),
  price: auctionListItemTradingPriceSchema.nullable(),
  your: auctionListItemTradingYourSchema.nullable(),
  red_bet_with_vat: z.boolean(),
  red_bet_no_vat: z.boolean(),
  is_last_bet_with_vat: z.boolean().nullable(),
})

export const auctionListItemSchema = z.object({
  main: auctionListItemMainSchema,
  organizer: auctionListItemOrganizerSchema,
  route: auctionListItemRouteSchema,
  cargo: auctionListItemCargoSchema,
  trading: auctionListItemTradingSchema,
  payment: auctionListItemPaymentSchema,
})
export type AuctionListItem = z.infer<typeof auctionListItemSchema>

export const auctionListMetaSchema = z.object({
  current_page: z.number().int(),
  from: z.number().int(),
  last_page: z.number().int(),
  per_page: z.number().int(),
  to: z.number().int(),
  total: z.number().int(),
})
export type AuctionListMeta = z.infer<typeof auctionListMetaSchema>

export const auctionListResponseSchema = z.object({
  data: z.array(auctionListItemSchema),
  meta: auctionListMetaSchema,
})
export type AuctionListResponse = z.infer<typeof auctionListResponseSchema>
