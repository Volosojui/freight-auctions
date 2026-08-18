import { Button, Card, Skeleton } from '@shared/ui'
import { AuctionCard, toAuctionCardVM } from '@entities/auction'
import type { FiltersSearch } from '@shared/lib/search'
import {
  useAuctionsListQuery,
  usePrefetchAuction,
} from '../model/use-auctions-list-query'
import { Pagination } from './pagination.component'

interface AuctionsListProps {
  search: FiltersSearch
  onPageChange: (page: number) => void
}

const SKELETON_COUNT = 4

export function AuctionsList({ search, onPageChange }: AuctionsListProps) {
  const query = useAuctionsListQuery(search)
  const prefetchAuction = usePrefetchAuction()

  if (query.isPending) {
    return (
      <div className="auctions-list" data-testid="auctions-skeleton">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <Card key={i} className="auction-card">
            <Skeleton height="1.2rem" width="40%" />
            <Skeleton height="1rem" width="70%" />
            <Skeleton height="1rem" width="55%" />
          </Card>
        ))}
      </div>
    )
  }

  if (query.isError) {
    return (
      <Card className="state" data-testid="auctions-error">
        <p className="state__text">Не удалось загрузить список аукционов.</p>
        <Button onClick={() => query.refetch()}>Повторить</Button>
      </Card>
    )
  }

  const { data, meta } = query.data

  if (data.length === 0) {
    return (
      <Card className="state" data-testid="auctions-empty">
        <p className="state__text">По заданным фильтрам аукционов не найдено.</p>
      </Card>
    )
  }

  return (
    <div>
      <div className="auctions-list" data-testid="auctions-list">
        {data.map((item) => (
          <AuctionCard
            key={item.main.order_uid}
            vm={toAuctionCardVM(item)}
            onIntent={prefetchAuction}
          />
        ))}
      </div>
      <Pagination meta={meta} onPageChange={onPageChange} />
    </div>
  )
}
