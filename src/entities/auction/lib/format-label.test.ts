import { describe, expect, it } from 'vitest'
import {
  auctionStatusLabel,
  auctionTypeLabel,
  bidMeasurementLabel,
  tradingStatusLabel,
} from './labels'
import { formatDate, formatDateTime, formatMoney } from './formatters'

describe('enum labels', () => {
  it('maps known members to Russian copy', () => {
    expect(auctionTypeLabel('Up')).toBe('На повышение')
    expect(auctionStatusLabel('Auction')).toBe('Идут торги')
    expect(tradingStatusLabel('Winner')).toBe('Победитель')
    expect(bidMeasurementLabel('PerKm')).toBe('За км')
  })

  it('renders Unknown as a safe dash', () => {
    expect(auctionTypeLabel('Unknown')).toBe('—')
    expect(auctionStatusLabel('Unknown')).toBe('—')
    expect(tradingStatusLabel('Unknown')).toBe('—')
  })
})

describe('formatters', () => {
  it('formatMoney returns null for null input', () => {
    expect(formatMoney(null)).toBeNull()
    expect(formatMoney(undefined)).toBeNull()
  })

  it('formatMoney renders a currency string', () => {
    const out = formatMoney(30000)
    expect(out).toContain('₽')
    expect(out).toContain('30')
  })

  it('formats dates without throwing', () => {
    expect(formatDate('2026-08-20T09:00:00+03:00')).toContain('2026')
    expect(formatDateTime('2026-08-20T09:00:00+03:00')).toContain('2026')
  })
})
