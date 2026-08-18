import { z } from 'zod'
import {
  auctionStatusSchema,
  auctionTypeSchema,
  bidMeasurementTypeSchema,
  operationTypeSchema,
  paymentDelayTypeSchema,
  tradingStatusSchema,
} from './enums'
import { docsSchema, loadingTypesSchema } from './common'

export const auctionShowMainSchema = z.object({
  id: z.number().int(),
  cargo_num: z.string(),
  cargo_date: z.string(),
  order_uid: z.string(),
  auc_type: auctionTypeSchema,
  created_at: z.string(),
})

export const auctionShowOrganizerSchema = z.object({
  subscriber_id: z.number().int(),
  subscriber_code: z.string(),
  infobase_code: z.string(),
  organization_name: z.string(),
  organization_inn: z.string(),
  organization_kpp: z.string(),
  organization_id: z.number().int(),
})

export const contactSchema = z.object({
  name: z.string().nullable(),
  phone: z.string().nullable(),
  work_phone: z.string().nullable(),
  uid: z.string().nullable(),
  email: z.string().nullable(),
})

export const carRequirementsSchema = z.object({
  type: z.string(),
  weight: z.number().nullable(),
  volume: z.number().nullable(),
  width: z.number().nullable(),
  length: z.number().nullable(),
  height: z.number().nullable(),
})

export const auctionShowCargoSchema = z.object({
  price: z.string(),
  currency: z.number().int().nullable(),
  is_international: z.boolean(),
  distance: z.number().int().nullable(),
  truck_count: z.number().int(),
  body_type: z.string(),
  temp_from: z.number().nullable(),
  temp_to: z.number().nullable(),
  conics: z.number().int().nullable(),
  belts: z.number().int().nullable(),
  adr: z.number().int().nullable(),
  coupling: z.boolean().nullable(),
  air_pass: z.boolean().nullable(),
  low_loader: z.boolean().nullable(),
  additional_load: z.boolean().nullable(),
  containered: z.boolean(),
  container_type: z.string().nullable(),
  container_size: z.string().nullable(),
  loading_types: loadingTypesSchema,
  docs: docsSchema,
  car: carRequirementsSchema,
})

export const auctionShowPaymentSchema = z.object({
  condition: z.string().nullable(),
  condition_predefined: z.string().nullable(),
  form: z.string(),
  delay: z.number().int().nullable(),
  delay_type: paymentDelayTypeSchema,
  currency_code: z.string(),
  prepay: z.string().nullable(),
})

export const assemblySchema = z.object({
  num: z.string().nullable(),
  date: z.string().nullable(),
})

export const auctionShowTradingPriceSchema = z.object({
  start: z.number().nullable(),
  start_no_vat: z.number().nullable(),
  current: z.number().nullable(),
  current_no_vat: z.number().nullable(),
  available: z.number().nullable(),
  available_no_vat: z.number().nullable(),
  min: z.number().nullable(),
  min_no_vat: z.number().nullable(),
  max: z.number().nullable(),
  max_no_vat: z.number().nullable(),
  step: z.number().nullable(),
  step_no_vat: z.number().nullable(),
  price_per_km: z.number(),
})

export const auctionShowTradingYourSchema = z.object({
  bet: z.boolean(),
  last_bet: z.number().nullable(),
  last_bet_with_vat: z.number().nullable(),
  win: z.boolean(),
})

export const auctionShowTradingSettingsSchema = z.object({
  prolong_after_bet: z.number().int().nullable(),
  winner_confirm: z.number().int().nullable(),
  winner_counter_mode: z.number().int().nullable(),
  transmission_time_in: z.number().int().nullable(),
  coefficient: z.number().int().nullable(),
})

export const auctionShowTradingSchema = z.object({
  status: auctionStatusSchema,
  status_mobile: tradingStatusSchema,
  start_time: z.string(),
  stop_time: z.string(),
  bid_measurement_type: bidMeasurementTypeSchema,
  can_set_bet: z.boolean(),
  allow_counter_bets: z.boolean(),
  hide_bets_history: z.boolean(),
  hide_places: z.boolean(),
  no_view_cargo_price: z.boolean(),
  hide_points_address_and_contacts: z.boolean(),
  is_bidder: z.boolean(),
  is_favorite: z.boolean(),
  is_last_bet_with_vat: z.boolean().nullable(),
  red_bet_with_vat: z.boolean(),
  red_bet_no_vat: z.boolean(),
  send_deal_before_load: z.boolean(),
  chat_id: z.string().nullable(),
  price: auctionShowTradingPriceSchema,
  your: auctionShowTradingYourSchema,
  settings: auctionShowTradingSettingsSchema,
})

export const routePointLocationSchema = z.object({
  city_name: z.string(),
  city_full_name: z.string(),
  city_gc_id: z.number().int(),
  loading_address: z.string(),
  lon: z.number(),
  lat: z.number(),
})

export const routePointCargoSchema = z.object({
  name: z.string(),
  package_name: z.string(),
  weight: z.string(),
  volume: z.string(),
  length: z.string(),
  width: z.string(),
  height: z.string(),
  oversized: z.boolean(),
  package_amount: z.number().int().nullable(),
})

export const routePointContactSchema = z.object({
  name: z.string(),
  phone: z.string(),
})

export const routePointSchema = z.object({
  row_num: z.number().int(),
  op_type: operationTypeSchema,
  start_date: z.string(),
  end_date: z.string(),
  comment: z.string().nullable(),
  contractor: z.string(),
  contractor_inn: z.string(),
  location: routePointLocationSchema,
  cargo: routePointCargoSchema,
  contact: routePointContactSchema,
})

export const admittedOrganizationSchema = z.object({
  id: z.number().int(),
  inn: z.string(),
  is_main: z.boolean(),
  name: z.string(),
  full_name: z.string(),
  site: z.string().nullable(),
  subscriber_id: z.number().int(),
  subscriber_code: z.string(),
  subscriber_role: z.string().nullable(),
  infobase_code: z.string(),
  infobase_address: z.string().nullable(),
  nalog_key: z.string().nullable(),
  hide_me: z.boolean(),
  current_vat_rate: z.string().nullable(),
})

export const auctionShowResponseSchema = z.object({
  main: auctionShowMainSchema,
  organizer: auctionShowOrganizerSchema,
  contacts: z.array(contactSchema),
  cargo: auctionShowCargoSchema,
  trading: auctionShowTradingSchema,
  payment: auctionShowPaymentSchema,
  assembly: assemblySchema,
  routes: z.array(routePointSchema),
  admitted_organizations: z.array(admittedOrganizationSchema),
  hide_bets_history: z.boolean().optional(),
})
export type AuctionShowResponse = z.infer<typeof auctionShowResponseSchema>
