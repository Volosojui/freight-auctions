import { describe, expect, it } from 'vitest'
import { buildAuctionListRequest } from './build-list-request'

describe('buildAuctionListRequest', () => {
  it('опускает undefined/null и пустые строки, сохраняя пагинацию', () => {
    const out = buildAuctionListRequest({
      page: 1,
      per_page: 20,
      cargo_num: '',
      load_city: undefined,
      current_price_from: null,
    })
    expect(out).toEqual({ page: 1, per_page: 20 })
  })

  it('сохраняет массивы и даты как есть', () => {
    const out = buildAuctionListRequest({
      statuses: [2],
      auc_type: ['Request', 'Up'],
      load_date_from: '2026-08-20T09:00:00+03:00',
    })
    expect(out).toEqual({
      statuses: [2],
      auc_type: ['Request', 'Up'],
      load_date_from: '2026-08-20T09:00:00+03:00',
    })
  })

  it('опускает пустые массивы и строки из одних пробелов', () => {
    const out = buildAuctionListRequest({
      cargo_num: '   ',
      body_types: [],
      customer: 'ЛИМ',
    })
    expect(out).toEqual({ customer: 'ЛИМ' })
  })
})
