import { beforeEach, describe, expect, it } from 'vitest'
import { getStore, resetStore } from './store'
import { placeBet } from './mutations'
import { toBetsVM } from '@entities/bet'

beforeEach(() => resetStore())

describe('placeBet', () => {
  it('appends a bet and updates current price and own-bet state', () => {
    const before = getStore().byUuid.get('auc-0001')!.bets.length
    const bet = placeBet(getStore(), 'auc-0001', 50000)

    expect(bet).not.toBeNull()
    const auction = getStore().byUuid.get('auc-0001')!
    expect(auction.bets).toHaveLength(before + 1)
    expect(auction.detail.trading.price.current).toBe(50000)
    expect(auction.detail.trading.your.bet).toBe(true)
    expect(auction.detail.trading.your.last_bet_with_vat).toBe(50000)
    expect(auction.listItem.trading.your?.bet).toBe(true)
  })

  it('leads when the new bid is the lowest price', () => {
    // existing lowest is 54000; 50000 becomes place 1.
    placeBet(getStore(), 'auc-0001', 50000)
    const auction = getStore().byUuid.get('auc-0001')!
    expect(auction.detail.trading.status_mobile).toBe('Leading')
    const mine = auction.bets.find((b) => b.organization_id === 22)!
    expect(mine.place).toBe(1)
  })

  it('does not lead when outbid by a lower existing price', () => {
    placeBet(getStore(), 'auc-0001', 59000)
    expect(getStore().byUuid.get('auc-0001')!.detail.trading.status_mobile).toBe(
      'Losing',
    )
  })

  it('adds a new participant to the bets list', () => {
    placeBet(getStore(), 'auc-0001', 50000)
    const vm = toBetsVM(getStore().byUuid.get('auc-0001')!.bets)
    expect(vm.participants).toBe(3) // orgs 14, 15 + our 22
  })

  it('returns null for an unknown auction', () => {
    expect(placeBet(getStore(), 'nope', 1000)).toBeNull()
  })
})
