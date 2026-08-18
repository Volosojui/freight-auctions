import { beforeEach, describe, expect, it } from 'vitest'
import { getAuction, listAuctions, listBets, setBet } from '../endpoints'
import { ApiRequestError } from '../problem'
import { getStore, resetStore } from './store'

beforeEach(() => resetStore())

describe('mock handlers — контракт ответов', () => {
  it('list: провалидированные данные и корректная meta/пагинация', async () => {
    const total = getStore().auctions.length
    const res = await listAuctions({ page: 1, per_page: 2 })

    expect(res.data).toHaveLength(2)
    expect(res.meta.per_page).toBe(2)
    expect(res.meta.total).toBe(total)
    expect(res.meta.last_page).toBe(Math.ceil(total / 2))
    expect(res.meta.from).toBe(1)
    expect(res.meta.to).toBe(2)
  })

  it('list: фильтр по cargo_num сужает набор', async () => {
    const res = await listAuctions({ cargo_num: '00000001003' })
    expect(res.data).toHaveLength(1)
    expect(res.meta.total).toBe(1)
    expect(res.data[0]?.main.cargo_num).toBe('00000001003')
  })

  it('list: пустой результат при несовпадении фильтра', async () => {
    const res = await listAuctions({ cargo_num: 'НЕТ-ТАКОГО' })
    expect(res.data).toEqual([])
    expect(res.meta.total).toBe(0)
    expect(res.meta.from).toBe(0)
  })

  it('detail: провалидированный DTO существующего аукциона', async () => {
    const res = await getAuction('auc-0001')
    expect(res.main.order_uid).toBe('auc-0001')
    expect(res.routes.length).toBeGreaterThanOrEqual(2)
  })

  it('detail: 404 ProblemDetail для неизвестного uuid', async () => {
    await expect(getAuction('нет-такого')).rejects.toBeInstanceOf(ApiRequestError)
  })

  it('bets: пусто при hide_bets_history', async () => {
    const res = await listBets('auc-0005')
    expect(res.bets).toEqual([])
  })

  it('bets: список для видимой истории', async () => {
    const res = await listBets('auc-0001')
    expect(res.bets.length).toBeGreaterThan(0)
  })

  it('setBet: 422 при price <= 0', async () => {
    const err = await setBet('auc-0001', { price: 0 }).catch((e) => e)
    expect(err).toBeInstanceOf(ApiRequestError)
    expect((err as ApiRequestError).status).toBe(422)
    expect((err as ApiRequestError).isValidation).toBe(true)
  })

  it('setBet: успех при валидной цене', async () => {
    await expect(setBet('auc-0001', { price: 53000 })).resolves.toBeTruthy()
  })
})
