import { Button, Card, Skeleton } from '@shared/ui'
import { BetRow, toBetsVM } from '@entities/bet'
import { useBetsQuery } from '../model/use-bets-query'
import '../bets-list.css'

interface Props {
  auctionUuid: string
  /** Whether bet history is visible (false when hide_bets_history is set). */
  canView: boolean
}

export function BetsList({ auctionUuid, canView }: Props) {
  const { data, isPending, isError, refetch } = useBetsQuery(auctionUuid, canView)

  if (!canView) {
    return (
      <Card className="section" data-testid="bets-hidden">
        <p className="state__text">История ставок скрыта организатором.</p>
      </Card>
    )
  }

  if (isPending) {
    return (
      <div className="bets-list" data-testid="bets-skeleton">
        <Skeleton height="64px" />
        <Skeleton height="64px" />
        <Skeleton height="64px" />
      </div>
    )
  }

  if (isError) {
    return (
      <Card className="section" data-testid="bets-error">
        <p className="state__text">Не удалось загрузить ставки.</p>
        <Button onClick={() => refetch()}>Повторить</Button>
      </Card>
    )
  }

  const { rows, participants } = toBetsVM(data.bets)

  if (rows.length === 0) {
    return (
      <Card className="section" data-testid="bets-empty">
        <p className="state__text">Ставок пока нет.</p>
      </Card>
    )
  }

  return (
    <Card className="section bets">
      <div className="bets__head">
        <h2 className="section__title">Ставки</h2>
        <span className="bets__count" data-testid="bets-participants">
          Участников: {participants}
        </span>
      </div>
      <div className="bets-list">
        {rows.map((row, i) => (
          <BetRow key={row.id} vm={row} rank={i + 1} />
        ))}
      </div>
    </Card>
  )
}
