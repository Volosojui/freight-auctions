import { describe, expect, it } from 'vitest'
import {
  parseSearch,
  serializeSearch,
  searchToListRequest,
} from './filters-search'

describe('parseSearch', () => {
  it('passes valid search through', () => {
    const out = parseSearch({
      page: 2,
      per_page: 10,
      cargo_num: '001',
      auc_type: ['Request', 'Up'],
      is_available: true,
    })
    expect(out).toMatchObject({
      page: 2,
      per_page: 10,
      cargo_num: '001',
      auc_type: ['Request', 'Up'],
      is_available: true,
    })
  })

  it('drops invalid page/per_page (undefined = default downstream)', () => {
    const out = parseSearch({ page: 'abc', per_page: -5 })
    expect(out.page).toBeUndefined()
    expect(out.per_page).toBeUndefined()
  })

  it('drops unknown enum members instead of crashing', () => {
    const out = parseSearch({ auc_type: ['Request', 'Bogus'] })
    // whole array is rejected -> falls back to undefined (safe)
    expect(out.auc_type).toBeUndefined()
  })

  it('stays safe for a totally malformed raw value', () => {
    const out = parseSearch({ page: {}, per_page: [], cargo_num: 123 })
    expect(out.page).toBeUndefined()
    expect(out.per_page).toBeUndefined()
    expect(out.cargo_num).toBeUndefined()
  })

  it('coerces numeric strings from a hand-typed URL', () => {
    const out = parseSearch({ page: '3', price_from: '15000' })
    expect(out.page).toBe(3)
    expect(out.price_from).toBe(15000)
  })
})

describe('serializeSearch', () => {
  it('strips undefined and empty arrays', () => {
    const out = serializeSearch({
      page: 1,
      per_page: 20,
      cargo_num: undefined,
      auc_type: [],
      load_city: 'Москва',
    })
    expect(out).toEqual({ page: 1, per_page: 20, load_city: 'Москва' })
  })
})

describe('searchToListRequest', () => {
  it('maps search fields to the API request and omits empties', () => {
    const out = searchToListRequest({
      page: 2,
      per_page: 20,
      cargo_num: '001',
      price_from: 1000,
      price_to: 5000,
      is_available: true,
    })
    expect(out).toEqual({
      page: 2,
      per_page: 20,
      cargo_num: '001',
      current_price_from: 1000,
      current_price_to: 5000,
      is_available: true,
    })
  })
})
