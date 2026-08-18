import type { BetRowVM } from '../model/bet-row-vm'

interface Props {
  vm: BetRowVM
  /** Fallback rank when the contract `place` is null. */
  rank: number
}

export function BetRow({ vm, rank }: Props) {
  const className = [
    'bet-row',
    vm.isWin && 'bet-row--win',
    vm.isRejected && 'bet-row--rejected',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={className} data-testid="bet-row">
      <div className="bet-row__place">{vm.place ?? rank}</div>

      <div className="bet-row__carrier">
        <div className="bet-row__org">
          <span>{vm.carrier}</span>
          {vm.isWin && <span className="badge badge--own">Победитель</span>}
          {vm.isCounter && <span className="badge badge--muted">Встречная</span>}
        </div>
        <div className="bet-row__contact">
          {vm.contactName}
          {vm.contactPhone ? ` · ${vm.contactPhone}` : ''}
        </div>
        {vm.isRejected && (
          <div className="bet-row__rejected" data-testid="bet-rejected">
            Ставка отменена{vm.cancelReason ? `: ${vm.cancelReason}` : ''}
          </div>
        )}
      </div>

      <div className="bet-row__prices">
        <div className="bet-row__price">
          {vm.priceWithVat} <span className="muted">с НДС</span>
        </div>
        <div className="bet-row__price bet-row__price--novat">
          {vm.priceNoVat} <span className="muted">без НДС</span>
        </div>
      </div>
    </div>
  )
}
