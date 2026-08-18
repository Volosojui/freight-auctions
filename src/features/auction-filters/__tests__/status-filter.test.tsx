import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AuctionFilters } from '../ui/auction-filters.component'
import { createFiltersStore } from '../model/filters-store'

describe('AuctionFilters — trading status ("Мой статус")', () => {
  it('renders trading-status options and emits the selected status on apply', () => {
    const onApply = vi.fn()
    render(
      <AuctionFilters store={createFiltersStore({})} onApply={onApply} />,
    )

    // Section is present.
    expect(screen.getByText('Мой статус')).toBeInTheDocument()

    // Toggle "Лидирую" (TradingStatus "Leading") and apply.
    fireEvent.click(screen.getByLabelText('Лидирую'))
    fireEvent.click(screen.getByRole('button', { name: 'Применить' }))

    expect(onApply).toHaveBeenCalledWith(
      expect.objectContaining({ status: ['Leading'] }),
    )
  })

  it('hydrates the checkbox from the URL search', () => {
    render(
      <AuctionFilters
        store={createFiltersStore({ status: ['Winner'] })}
        onApply={vi.fn()}
      />,
    )
    expect(screen.getByLabelText('Победитель')).toBeChecked()
  })
})
