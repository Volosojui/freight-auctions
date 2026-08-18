import { Button, Card } from '@shared/ui'
import type { DetailVM } from '@entities/auction'
import { MainSection } from './main-section.component'
import { OrganizerSection } from './organizer-section.component'
import { RouteSection } from './route-section.component'
import { CargoSection } from './cargo-section.component'
import { PaymentSection } from './payment-section.component'
import { PriceSection } from './price-section.component'
import '../auction-detail.css'

interface Props {
  vm: DetailVM
  /** Opens the bets tab; wired by the page (bets-view). */
  onViewBets?: () => void
  /** Opens the bid form; wired by the page (place-bet). */
  onPlaceBet?: () => void
}

/** Composes all detail sections and the flag-driven action entry points. */
export function AuctionDetailView({ vm, onViewBets, onPlaceBet }: Props) {
  const { flags } = vm

  return (
    <div className="detail">
      <Card className="section detail__actions">
        {/* Entry points. Navigation targets (bets tab / bid form) are wired
            by the bets-view and place-bet changes; availability is driven by
            the DTO flags here. */}
        <Button
          variant="primary"
          disabled={!flags.canSetBet}
          onClick={onPlaceBet}
          data-testid="bid-action"
        >
          Сделать ставку
        </Button>
        <Button
          variant="secondary"
          disabled={!flags.canViewBets}
          onClick={onViewBets}
          data-testid="bets-action"
        >
          Смотреть ставки
        </Button>
        {!flags.canViewBets && (
          <span className="detail__note">История ставок скрыта</span>
        )}
      </Card>

      <div className="detail__grid">
        <MainSection vm={vm} />
        <PriceSection vm={vm} />
        <OrganizerSection vm={vm} />
        <CargoSection vm={vm} />
        <RouteSection vm={vm} />
        <PaymentSection vm={vm} />
      </div>
    </div>
  )
}
