import { Link } from '@tanstack/react-router'
import { Button, Card } from '@shared/ui'
import type { AuctionCardVM } from '../model/card-vm'

interface AuctionCardProps {
  vm: AuctionCardVM
  /** Called on hover/focus to prefetch the detail (intent). */
  onIntent?: (uuid: string) => void
}

export function AuctionCard({ vm, onIntent }: AuctionCardProps) {
  const handleIntent = () => onIntent?.(vm.uuid)

  return (
    <Card
      className="auction-card"
      onMouseEnter={handleIntent}
      onFocus={handleIntent}
      data-testid="auction-card"
    >
      <div className="auction-card__head">
        <Link
          to="/auctions/$auctionUuid"
          params={{ auctionUuid: vm.uuid }}
          className="auction-card__num"
        >
          № {vm.cargoNum}
        </Link>
        <span className="auction-card__type">{vm.typeLabel}</span>
      </div>

      <div className="auction-card__badges">
        <span className="badge">{vm.statusLabel}</span>
        <span className="badge badge--muted">{vm.tradingStatusLabel}</span>
        {vm.hasOwnBet && <span className="badge badge--own">Моя ставка</span>}
      </div>

      <div className="auction-card__route">
        <strong>{vm.route.from}</strong>
        <span className="auction-card__arrow"> → </span>
        <strong>{vm.route.to}</strong>
      </div>

      <dl className="auction-card__meta">
        <div>
          <dt>Погрузка</dt>
          <dd>{vm.loadDate}</dd>
        </div>
        <div>
          <dt>Выгрузка</dt>
          <dd>{vm.unloadDate}</dd>
        </div>
        <div>
          <dt>Груз</dt>
          <dd>
            {vm.cargo.name} · {vm.cargo.weightVolume} · {vm.cargo.bodyType}
          </dd>
        </div>
        <div>
          <dt>Цена / за км / шаг</dt>
          <dd>
            {vm.currentPrice} · {vm.pricePerKm} · {vm.step}
          </dd>
        </div>
      </dl>

      <div className="auction-card__action">
        {vm.primaryAction.disabled ? (
          <Button variant="secondary" disabled>
            {vm.primaryAction.label}
          </Button>
        ) : (
          <Link to="/auctions/$auctionUuid" params={{ auctionUuid: vm.uuid }}>
            <Button variant={vm.primaryAction.kind === 'view' ? 'secondary' : 'primary'}>
              {vm.primaryAction.label}
            </Button>
          </Link>
        )}
      </div>
    </Card>
  )
}
