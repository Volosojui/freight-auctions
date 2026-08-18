import { z } from 'zod'

export const betItemPriceInfoSchema = z.object({
  price_with_vat: z.number().nullable(),
  price_no_vat: z.number().nullable(),
  payment_type: z.string().nullable(),
  vat_rate: z.string().nullable(),
})

export const betItemSchema = z.object({
  id: z.number().int(),
  created_at: z.string(),
  auction_id: z.number().int(),
  subscriber_id: z.number().int(),
  contact_name: z.string(),
  contact_phone: z.string(),
  price_with_vat: z.number(),
  price_no_vat: z.number(),
  organization_id: z.number().int(),
  organization_inn: z.string(),
  organization_name: z.string(),
  transporter_comment: z.string().nullable(),
  is_rejected: z.boolean(),
  is_counter: z.boolean(),
  place: z.number().int().nullable(),
  is_win: z.boolean(),
  run_number: z.number().int(),
  cancel_reason: z.string(),
  price_info: betItemPriceInfoSchema,
})
export type BetItem = z.infer<typeof betItemSchema>

export const betListResponseSchema = z.object({
  bets: z.array(betItemSchema),
})
export type BetListResponse = z.infer<typeof betListResponseSchema>
