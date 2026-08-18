import { useState } from 'react'
import { Link, useParams } from '@tanstack/react-router'
import { ApiRequestError } from '@shared/api'
import { Button, Skeleton, Spinner } from '@shared/ui'
import { AuctionDetailView } from '@widgets/auction-detail'
import { BetsList } from '@widgets/bets-list'
import { toDetailVM, useAuctionDetailQuery } from '@entities/auction'

type Tab = 'details' | 'bets'

export function AuctionDetailPage() {
  const { auctionUuid } = useParams({ from: '/auctions/$auctionUuid' })
  const { data, isPending, isError, error, refetch } =
    useAuctionDetailQuery(auctionUuid)
  const [tab, setTab] = useState<Tab>('details')

  const isNotFound = error instanceof ApiRequestError && error.status === 404
  const vm = data ? toDetailVM(data) : null

  return (
    <section className="page">
      <p className="breadcrumbs">
        <Link to="/">← К списку</Link>
      </p>
      <h1 className="page__title">Аукцион</h1>

      {isPending ? (
        <div className="detail-loading" data-testid="detail-skeleton">
          <Spinner />
          <Skeleton height="120px" />
          <Skeleton height="120px" />
        </div>
      ) : isNotFound ? (
        <div className="state" data-testid="detail-not-found">
          <p className="state__text">Аукцион не найден.</p>
          <Link to="/">
            <Button>Вернуться к списку</Button>
          </Link>
        </div>
      ) : isError ? (
        <div className="state" data-testid="detail-error">
          <p className="state__text">Не удалось загрузить аукцион.</p>
          <Button onClick={() => refetch()}>Повторить</Button>
        </div>
      ) : vm ? (
        <>
          <div className="tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'details'}
              className={tab === 'details' ? 'tab tab--active' : 'tab'}
              onClick={() => setTab('details')}
              data-testid="tab-details"
            >
              Аукцион
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'bets'}
              className={tab === 'bets' ? 'tab tab--active' : 'tab'}
              disabled={!vm.flags.canViewBets}
              onClick={() => setTab('bets')}
              data-testid="tab-bets"
            >
              Ставки
            </button>
          </div>

          {tab === 'details' ? (
            <AuctionDetailView
              vm={vm}
              onViewBets={
                vm.flags.canViewBets ? () => setTab('bets') : undefined
              }
            />
          ) : (
            <BetsList auctionUuid={auctionUuid} canView={vm.flags.canViewBets} />
          )}
        </>
      ) : null}
    </section>
  )
}
