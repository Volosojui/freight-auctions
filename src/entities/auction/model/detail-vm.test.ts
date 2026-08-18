import { describe, expect, it } from 'vitest'
import { getStore } from '@shared/api/mock/store'
import { toDetailVM } from './detail-vm'

function detail(uuid: string) {
  const auction = getStore().byUuid.get(uuid)
  if (!auction) throw new Error(`seed missing: ${uuid}`)
  return auction.detail
}

describe('toDetailVM — flags', () => {
  it('no hiding: shows contacts, addresses, cargo price; bid allowed', () => {
    const vm = toDetailVM(detail('auc-0001'))
    expect(vm.flags.canSetBet).toBe(true)
    expect(vm.flags.canViewBets).toBe(true)
    expect(vm.contacts).not.toBeNull()
    expect(vm.cargo.price).not.toBeNull()
    expect(vm.route.every((p) => p.address !== null)).toBe(true)
    expect(vm.route.every((p) => p.contact !== null)).toBe(true)
  })

  it('hide_points_address_and_contacts hides contacts and addresses', () => {
    const vm = toDetailVM(detail('auc-0006'))
    expect(vm.flags.hidePointsAndContacts).toBe(true)
    expect(vm.contacts).toBeNull()
    expect(vm.route.every((p) => p.address === null)).toBe(true)
    expect(vm.route.every((p) => p.contact === null)).toBe(true)
  })

  it('no_view_cargo_price hides the cargo price', () => {
    const vm = toDetailVM(detail('auc-0006'))
    expect(vm.flags.hideCargoPrice).toBe(true)
    expect(vm.cargo.price).toBeNull()
  })

  it('hide_bets_history sets canViewBets = false', () => {
    expect(toDetailVM(detail('auc-0005')).flags.canViewBets).toBe(false)
  })

  it('can_set_bet = false sets canSetBet = false', () => {
    expect(toDetailVM(detail('auc-0004')).flags.canSetBet).toBe(false)
  })
})

describe('toDetailVM — content', () => {
  it('maps enum labels and keeps all route points', () => {
    const src = detail('auc-0001')
    const vm = toDetailVM(src)
    expect(vm.aucTypeLabel).toBe('Запрос цены')
    expect(vm.route).toHaveLength(src.routes.length)
    expect(vm.route.length).toBeGreaterThanOrEqual(2)
  })

  it('reflects the own-bid state', () => {
    expect(toDetailVM(detail('auc-0001')).your.hasBet).toBe(true)
    expect(toDetailVM(detail('auc-0003')).your.hasBet).toBe(false)
  })

  it('exposes current/available prices and min/max/step', () => {
    const vm = toDetailVM(detail('auc-0001'))
    expect(vm.price.current).not.toBeNull()
    expect(vm.price.available).not.toBeNull()
    expect(vm.price.min).not.toBeNull()
    expect(vm.price.max).not.toBeNull()
    expect(vm.price.step).not.toBeNull()
  })
})
