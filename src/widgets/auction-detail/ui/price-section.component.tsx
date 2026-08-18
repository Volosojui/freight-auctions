import { Card } from '@shared/ui'
import type { DetailVM } from '@entities/auction'
import { Field } from './field.component'

interface Props {
  vm: DetailVM
}

/** Prices (with/without VAT) and the user's own bid state. */
export function PriceSection({ vm }: Props) {
  const { price, your } = vm

  return (
    <Card className="section section--price">
      <h2 className="section__title">Цены и торги</h2>
      <div className="section__grid">
        <Field label="Текущая цена">{price.current ?? '—'}</Field>
        <Field label="Текущая без НДС">{price.currentNoVat ?? '—'}</Field>
        <Field label="Доступная цена">{price.available ?? '—'}</Field>
        {price.min !== null && <Field label="Минимум">{price.min}</Field>}
        {price.max !== null && <Field label="Максимум">{price.max}</Field>}
        {price.step !== null && <Field label="Шаг ставки">{price.step}</Field>}
        <Field label="Цена за км">{price.pricePerKm}</Field>
      </div>

      <div className="your-bet">
        <h3 className="your-bet__title">Ваша ставка</h3>
        {your.hasBet ? (
          <div className="section__grid">
            <Field label="Последняя ставка">{your.lastBetWithVat ?? '—'}</Field>
            <Field label="Без НДС">{your.lastBet ?? '—'}</Field>
            <Field label="Победа">{your.win ? 'Да' : 'Нет'}</Field>
          </div>
        ) : (
          <p className="section__note" data-testid="no-bet">
            Вы ещё не делали ставку.
          </p>
        )}
      </div>
    </Card>
  )
}
