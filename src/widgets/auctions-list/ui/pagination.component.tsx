import { Button } from '@shared/ui'
import type { AuctionListMeta } from '@shared/api'

interface PaginationProps {
  meta: AuctionListMeta
  onPageChange: (page: number) => void
}

export function Pagination({ meta, onPageChange }: PaginationProps) {
  const { current_page, last_page, total } = meta
  const canPrev = current_page > 1
  const canNext = current_page < last_page

  return (
    <nav className="pagination" aria-label="Пагинация">
      <Button
        variant="secondary"
        disabled={!canPrev}
        onClick={() => onPageChange(current_page - 1)}
      >
        ← Назад
      </Button>
      <span className="pagination__info" data-testid="pagination-info">
        Страница {current_page} из {last_page} · всего {total}
      </span>
      <Button
        variant="secondary"
        disabled={!canNext}
        onClick={() => onPageChange(current_page + 1)}
      >
        Вперёд →
      </Button>
    </nav>
  )
}
