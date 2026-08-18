import { describe, expect, it } from 'vitest'
import { auctionTypeSchema, tradingStatusSchema } from './enums'
import {
  auctionListItemTradingSchema,
  auctionListItemTradingYourSchema,
} from './auction-list'

describe('enum schemas', () => {
  it('неизвестное значение приводится к Unknown', () => {
    expect(auctionTypeSchema.parse('Nonsense')).toBe('Unknown')
    expect(tradingStatusSchema.parse('???')).toBe('Unknown')
  })

  it('известное значение сохраняется', () => {
    expect(auctionTypeSchema.parse('Up')).toBe('Up')
    expect(tradingStatusSchema.parse('Winner')).toBe('Winner')
  })
})

describe('nullable-поля', () => {
  it('your.last_bet принимает null', () => {
    expect(
      auctionListItemTradingYourSchema.parse({ bet: false, last_bet: null }),
    ).toEqual({ bet: false, last_bet: null })
  })

  it('nullable enum bid_measurement_type: null проходит, мусор → Unknown', () => {
    const base = {
      status: 'Auction',
      status_mobile: 'Leading',
      start_time: '2026-08-19T10:00:00+03:00',
      stop_time: '2026-08-25T10:00:00+03:00',
      can_set_bet: true,
      allow_counter_bets: true,
      hide_points_address_and_contacts: false,
      direction: null,
      comment: null,
      is_bidder: true,
      is_available: true,
      is_accredited: true,
      is_favorite: false,
      price: null,
      your: null,
      red_bet_with_vat: false,
      red_bet_no_vat: false,
      is_last_bet_with_vat: null,
    }
    expect(
      auctionListItemTradingSchema.parse({ ...base, bid_measurement_type: null })
        .bid_measurement_type,
    ).toBeNull()
    expect(
      auctionListItemTradingSchema.parse({
        ...base,
        bid_measurement_type: 'weird',
      }).bid_measurement_type,
    ).toBe('Unknown')
  })
})
