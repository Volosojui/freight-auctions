import { Card } from '@shared/ui'
import type { DetailVM } from '@entities/auction'
import { Field } from './field.component'

interface Props {
  vm: DetailVM
}

/** Main auction data + trading parameters. */
export function MainSection({ vm }: Props) {
  return (
    <Card className="section">
      <h2 className="section__title">Основное</h2>
      <div className="section__grid">
        <Field label="Номер заявки">{vm.cargoNum}</Field>
        <Field label="Тип аукциона">{vm.aucTypeLabel}</Field>
        <Field label="Статус">{vm.auctionStatusLabel}</Field>
        <Field label="Ваш статус">{vm.tradingStatusLabel}</Field>
        <Field label="Создан">{vm.createdAt}</Field>
        <Field label="Дата груза">{vm.cargoDate}</Field>
        <Field label="Начало торгов">{vm.trading.startTime}</Field>
        <Field label="Окончание торгов">{vm.trading.stopTime}</Field>
        <Field label="Единица ставки">{vm.trading.bidMeasurementLabel}</Field>
      </div>
    </Card>
  )
}
