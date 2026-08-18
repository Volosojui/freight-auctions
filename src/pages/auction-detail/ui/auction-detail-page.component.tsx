import { Link, useParams } from '@tanstack/react-router'
import { ApiRequestError } from '@shared/api'
import { Button, Skeleton, Spinner } from '@shared/ui'
import { AuctionDetailView } from '@widgets/auction-detail'
import { toDetailVM, useAuctionDetailQuery } from '@entities/auction'

export function AuctionDetailPage() {
  const { auctionUuid } = useParams({ from: '/auctions/$auctionUuid' })
  const { data, isPending, isError, error, refetch } =
    useAuctionDetailQuery(auctionUuid)

  const isNotFound = error instanceof ApiRequestError && error.status === 404

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
      ) : (
        <AuctionDetailView vm={toDetailVM(data)} />
      )}
    </section>
  )
}
