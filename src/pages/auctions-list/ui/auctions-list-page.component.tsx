import { useState } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { SlidersHorizontal, X } from 'lucide-react'
import { AuctionsList } from '@widgets/auctions-list'
import {
  AuctionFilters,
  createFiltersStore,
  activeChips,
  countActiveFilters,
  removeChip,
} from '@features/auction-filters'
import { Button, Drawer } from '@shared/ui'
import type { FiltersSearch } from '@shared/lib/search'

export function AuctionsListPage() {
  const search = useSearch({ from: '/' })
  const navigate = useNavigate()
  const [drawerOpen, setDrawerOpen] = useState(false)
  // Hydrate the draft store once from the initial URL search.
  const [store] = useState(() => createFiltersStore(search))

  const applySearch = (next: FiltersSearch) => {
    navigate({ to: '/', search: next })
    setDrawerOpen(false)
  }
  const changePage = (page: number) =>
    navigate({ to: '/', search: { ...search, page } })

  const chips = activeChips(search)
  const activeCount = countActiveFilters(search)

  const openDrawer = () => {
    store.hydrate(search)
    setDrawerOpen(true)
  }

  return (
    <section className="page auctions-page">
      <h1 className="page__title">Аукционы</h1>

      <div className="auctions-toolbar">
        <Button
          variant="secondary"
          onClick={openDrawer}
          data-testid="filters-open"
        >
          <SlidersHorizontal size={16} aria-hidden="true" />
          Фильтры
          {activeCount > 0 && (
            <span className="filters-count" data-testid="filters-count">
              {activeCount}
            </span>
          )}
        </Button>

        {chips.length > 0 && (
          <div className="active-filters" data-testid="active-filters">
            {chips.map((chip) => (
              <button
                key={chip.id}
                type="button"
                className="filter-chip"
                onClick={() => navigate({ to: '/', search: removeChip(search, chip.id) })}
                aria-label={`Убрать фильтр: ${chip.label}`}
              >
                {chip.label}
                <X size={13} aria-hidden="true" />
              </button>
            ))}
          </div>
        )}
      </div>

      <AuctionsList search={search} onPageChange={changePage} />

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Фильтры"
      >
        <AuctionFilters store={store} onApply={applySearch} />
      </Drawer>
    </section>
  )
}
