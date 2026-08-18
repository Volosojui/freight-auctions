import { Link, useParams } from '@tanstack/react-router'
import { Card } from '@shared/ui'

/**
 * Заглушка детальной страницы аукциона.
 * Полная реализация (GET /auctions/{uuid}, секции, ограничения DTO) — в change `auction-detail`.
 */
export function AuctionDetailPage() {
  const { auctionUuid } = useParams({ from: '/auctions/$auctionUuid' })

  return (
    <section className="page">
      <p className="breadcrumbs">
        <Link to="/">← К списку</Link>
      </p>
      <h1 className="page__title">Аукцион</h1>
      <Card className="placeholder">
        <p>
          Детальная страница аукциона <code>{auctionUuid}</code>.
        </p>
        <p className="placeholder__hint">
          Реализуется в change <code>auction-detail</code>.
        </p>
      </Card>
    </section>
  )
}
