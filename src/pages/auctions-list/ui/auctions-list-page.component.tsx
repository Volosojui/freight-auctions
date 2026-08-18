import { Card } from '@shared/ui'

/**
 * Заглушка страницы списка аукционов.
 * Полная реализация (Query, фильтры, пагинация, состояния) — в change `auctions-list`.
 */
export function AuctionsListPage() {
  return (
    <section className="page">
      <h1 className="page__title">Аукционы</h1>
      <Card className="placeholder">
        <p>Список аукционов появится здесь.</p>
        <p className="placeholder__hint">
          Реализуется в change <code>auctions-list</code>.
        </p>
      </Card>
    </section>
  )
}
