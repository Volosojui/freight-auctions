import { beforeEach, describe, expect, it } from 'vitest'
import { getStore, resetStore } from '@shared/api/mock/store'
import type { AuctionListItem } from '@shared/api'
import { resolvePrimaryAction, toAuctionCardVM } from './card-vm'

beforeEach(() => resetStore())

const itemByUuid = (uuid: string): AuctionListItem => {
  const found = getStore().auctions.find((a) => a.uuid === uuid)
  if (!found) throw new Error(`seed ${uuid} missing`)
  return found.listItem
}

describe('toAuctionCardVM', () => {
  it('maps contract fields to Russian display labels', () => {
    const vm = toAuctionCardVM(itemByUuid('auc-0001'))
    expect(vm.cargoNum).toBe('00000001001')
    expect(vm.typeLabel).toBe('Запрос цены')
    expect(vm.statusLabel).toBe('Идут торги')
    expect(vm.tradingStatusLabel).toBe('Лидирую')
    expect(vm.route).toEqual({ from: 'Пермь', to: 'Москва' })
    expect(vm.hasOwnBet).toBe(true)
    expect(vm.currentPrice).toMatch(/54\s?000/)
  })
})

describe('resolvePrimaryAction', () => {
  const make = (
    can_set_bet: boolean,
    hasBet: boolean,
    status = 'Auction',
  ): AuctionListItem =>
    ({
      trading: { can_set_bet, your: { bet: hasBet }, status },
    }) as unknown as AuctionListItem

  it('edit when a bet can be set and one already exists', () => {
    expect(resolvePrimaryAction(make(true, true)).kind).toBe('edit')
  })

  it('create when a bet can be set and none exists', () => {
    expect(resolvePrimaryAction(make(true, false)).kind).toBe('create')
  })

  it('view when a bet cannot be set on a live auction', () => {
    expect(resolvePrimaryAction(make(false, false)).kind).toBe('view')
  })

  it('disabled on a terminal auction with no own bet', () => {
    const action = resolvePrimaryAction(make(false, false, 'Canceled'))
    expect(action.kind).toBe('disabled')
    expect(action.disabled).toBe(true)
  })
})
