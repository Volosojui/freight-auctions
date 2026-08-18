import { Card } from '@shared/ui'
import type { DetailVM } from '@entities/auction'
import { Field } from './field.component'

interface Props {
  vm: DetailVM
}

/** Cargo + vehicle requirements. Cargo price is hidden when the DTO flag is set. */
export function CargoSection({ vm }: Props) {
  const { cargo } = vm

  return (
    <Card className="section">
      <h2 className="section__title">Груз и требования к ТС</h2>
      <div className="section__grid">
        <Field label="Тип кузова">{cargo.bodyType}</Field>
        <Field label="Кол-во машин">{cargo.truckCount}</Field>
        <Field label="Расстояние">
          {cargo.distanceKm !== null ? `${cargo.distanceKm} км` : '—'}
        </Field>
        <Field label="Международная">
          {cargo.isInternational ? 'Да' : 'Нет'}
        </Field>
        {!vm.flags.hideCargoPrice && (
          <Field label="Цена груза">{cargo.price ?? '—'}</Field>
        )}
        <Field label="Тип ТС">{cargo.car.type}</Field>
        <Field label="Грузоподъёмность">
          {cargo.car.weight !== null ? `${cargo.car.weight} т` : '—'}
        </Field>
        <Field label="Объём ТС">
          {cargo.car.volume !== null ? `${cargo.car.volume} м³` : '—'}
        </Field>
      </div>

      {cargo.loadingTypes.length > 0 && (
        <p className="section__tags">
          Загрузка: {cargo.loadingTypes.join(', ')}
        </p>
      )}
      {cargo.docs.length > 0 && (
        <p className="section__tags">Документы: {cargo.docs.join(', ')}</p>
      )}
    </Card>
  )
}
