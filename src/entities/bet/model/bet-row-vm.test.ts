import { beforeEach, describe, expect, it } from 'vitest'
import { getStore, resetStore } from '@shared/api/mock/store'
import { toBetRowVM, toBetsVM } from './bet-row-vm'

beforeEach(() => resetStore())

const betsOf = (uuid: string) => getStore().byUuid.get(uuid)!.bets

describe('toBetRowVM', () => {
  it('normalizes empty cancel_reason to null and formats both prices', () => {
    const vm = toBetRowVM(betsOf('auc-0001')[0])
    expect(vm.cancelReason).toBeNull()
    expect(vm.place).toBe(1)
    expect(vm.isRejected).toBe(false)
    expect(vm.carrier).toBe('ООО Перевозчик-1')
    expect(vm.priceWithVat).toContain('54')
    expect(vm.priceNoVat).not.toBe('—')
  })

  it('keeps place null and the cancel reason for a rejected bet', () => {
    const rejected = betsOf('auc-0001').find((b) => b.is_rejected)!
    const vm = toBetRowVM(rejected)
    expect(vm.isRejected).toBe(true)
    expect(vm.place).toBeNull()
    expect(vm.cancelReason).toBe('Не прошёл аккредитацию')
  })

  it('flags the winning bet', () => {
    const win = betsOf('auc-0006').find((b) => b.is_win)!
    expect(toBetRowVM(win).isWin).toBe(true)
  })

  it('falls back to contact name and nulls an empty phone', () => {
    const vm = toBetRowVM({
      ...betsOf('auc-0001')[0],
      organization_name: '',
      contact_name: 'Кто-то',
      contact_phone: '',
    })
    expect(vm.carrier).toBe('Кто-то')
    expect(vm.contactPhone).toBeNull()
  })
})

describe('toBetsVM', () => {
  it('counts distinct non-rejected carriers as participants', () => {
    const vm = toBetsVM(betsOf('auc-0001'))
    expect(vm.rows).toHaveLength(3)
    expect(vm.participants).toBe(2)
  })

  it('is empty for an auction without bets', () => {
    expect(toBetsVM(betsOf('auc-0003')).rows).toHaveLength(0)
  })
})
