import { useState } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { AuctionsList } from '@widgets/auctions-list'
import { AuctionFilters, createFiltersStore } from '@features/auction-filters'
import type { FiltersSearch } from '@shared/lib/search'

export function AuctionsListPage() {
  const search = useSearch({ from: '/' })
  const navigate = useNavigate()
  // Hydrate the draft store once from the initial URL search.
  const [store] = useState(() => createFiltersStore(search))

  const applySearch = (next: FiltersSearch) =>
    navigate({ to: '/', search: next })

  const changePage = (page: number) =>
    navigate({ to: '/', search: { ...search, page } })

  return (
    <section className="page auctions-page">
      <h1 className="page__title">Аукционы</h1>
      <div className="auctions-page__layout">
        <aside className="auctions-page__filters">
          <AuctionFilters store={store} onApply={applySearch} />
        </aside>
        <div className="auctions-page__list">
          <AuctionsList search={search} onPageChange={changePage} />
        </div>
      </div>
    </section>
  )
}
