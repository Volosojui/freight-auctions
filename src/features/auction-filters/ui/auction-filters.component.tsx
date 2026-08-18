import { observer } from 'mobx-react-lite'
import { Button, Card } from '@shared/ui'
import { CITIES } from '@shared/api/mock/cities'
import { AUCTION_STATUS_LABELS, AUCTION_TYPE_LABELS } from '@entities/auction'
import type { AucTypeFilter, FiltersSearch } from '@shared/lib/search'
import type { FiltersStore } from '../model/filters-store'

interface AuctionFiltersProps {
  store: FiltersStore
  onApply: (search: FiltersSearch) => void
}

const AUC_TYPES: AucTypeFilter[] = ['Request', 'Up', 'Down', 'FixPrice']

const STATUS_OPTIONS: { code: number; value: keyof typeof AUCTION_STATUS_LABELS }[] =
  [
    { code: 1, value: 'Planning' },
    { code: 2, value: 'Auction' },
    { code: 3, value: 'DeterminateWinner' },
    { code: 4, value: 'WaitDeal' },
    { code: 5, value: 'InProgress' },
    { code: 6, value: 'Finished' },
    { code: 7, value: 'Stopped' },
    { code: 8, value: 'Canceled' },
  ]

export const AuctionFilters = observer(function AuctionFilters({
  store,
  onApply,
}: AuctionFiltersProps) {
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    onApply(store.toSearch())
  }

  const reset = () => {
    store.reset()
    onApply(store.toSearch())
  }

  return (
    <Card className="filters" aria-label="Фильтры">
      <form className="filters__form" onSubmit={submit}>
        <label className="field">
          <span className="field__label">Номер заявки</span>
          <input
            className="field__input"
            value={store.cargoNum}
            onChange={(e) => store.setField('cargoNum', e.target.value)}
            placeholder="00000001001"
          />
        </label>

        <div className="field">
          <span className="field__label">Тип аукциона</span>
          <div className="chips">
            {AUC_TYPES.map((t) => (
              <label key={t} className="chip">
                <input
                  type="checkbox"
                  checked={store.aucType.includes(t)}
                  onChange={() => store.toggleAucType(t)}
                />
                {AUCTION_TYPE_LABELS[t]}
              </label>
            ))}
          </div>
        </div>

        <div className="field">
          <span className="field__label">Статус аукциона</span>
          <div className="chips">
            {STATUS_OPTIONS.map(({ code, value }) => (
              <label key={code} className="chip">
                <input
                  type="checkbox"
                  checked={store.statuses.includes(code)}
                  onChange={() => store.toggleStatus(code)}
                />
                {AUCTION_STATUS_LABELS[value]}
              </label>
            ))}
          </div>
        </div>

        <label className="field">
          <span className="field__label">Город погрузки</span>
          <select
            className="field__input"
            value={store.loadCity}
            onChange={(e) => store.setField('loadCity', e.target.value)}
          >
            <option value="">Любой</option>
            {CITIES.map((c) => (
              <option key={c.gc_id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="field__label">Город выгрузки</span>
          <select
            className="field__input"
            value={store.unloadCity}
            onChange={(e) => store.setField('unloadCity', e.target.value)}
          >
            <option value="">Любой</option>
            {CITIES.map((c) => (
              <option key={c.gc_id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="field__label">Погрузка с</span>
          <input
            className="field__input"
            type="date"
            value={store.loadDateFrom.slice(0, 10)}
            onChange={(e) =>
              store.setField(
                'loadDateFrom',
                e.target.value ? `${e.target.value}T00:00:00+03:00` : '',
              )
            }
          />
        </label>

        <label className="field">
          <span className="field__label">Погрузка по</span>
          <input
            className="field__input"
            type="date"
            value={store.loadDateTo.slice(0, 10)}
            onChange={(e) =>
              store.setField(
                'loadDateTo',
                e.target.value ? `${e.target.value}T23:59:59+03:00` : '',
              )
            }
          />
        </label>

        <label className="field">
          <span className="field__label">Цена от</span>
          <input
            className="field__input"
            type="number"
            value={store.priceFrom}
            onChange={(e) => store.setField('priceFrom', e.target.value)}
          />
        </label>

        <label className="field">
          <span className="field__label">Цена до</span>
          <input
            className="field__input"
            type="number"
            value={store.priceTo}
            onChange={(e) => store.setField('priceTo', e.target.value)}
          />
        </label>

        <label className="chip">
          <input
            type="checkbox"
            checked={store.isAvailable}
            onChange={() => store.toggleFlag('isAvailable')}
          />
          Только доступные
        </label>

        <label className="chip">
          <input
            type="checkbox"
            checked={store.isBidder}
            onChange={() => store.toggleFlag('isBidder')}
          />
          Только с моим участием
        </label>

        <div className="filters__actions">
          <Button type="submit">Применить</Button>
          <Button type="button" variant="ghost" onClick={reset}>
            Сбросить
          </Button>
        </div>
      </form>
    </Card>
  )
})
