import { describe, expect, it } from 'vitest'
import { makeBetSchema } from './bet-schema'

const schema = makeBetSchema({ min: 40000, max: 60000, step: 500 })
const check = (price: number) => schema.safeParse({ price })

describe('makeBetSchema', () => {
  it('rejects empty / non-numeric price', () => {
    expect(schema.safeParse({ price: Number.NaN }).success).toBe(false)
  })

  it('rejects price <= 0', () => {
    expect(check(0).success).toBe(false)
    expect(check(-100).success).toBe(false)
  })

  it('rejects a price below min or above max', () => {
    expect(check(39000).success).toBe(false)
    expect(check(61000).success).toBe(false)
  })

  it('rejects a price not on the step grid', () => {
    expect(check(54250).success).toBe(false) // (54250-40000)/500 = 28.5
  })

  it('accepts a valid in-range, on-step price', () => {
    expect(check(54000).success).toBe(true) // (54000-40000)/500 = 28
    expect(check(40000).success).toBe(true) // lower boundary
    expect(check(60000).success).toBe(true) // upper boundary
  })

  it('without bounds enforces only price > 0', () => {
    const bare = makeBetSchema({})
    expect(bare.safeParse({ price: 12345.67 }).success).toBe(true)
    expect(bare.safeParse({ price: 0 }).success).toBe(false)
  })
})
