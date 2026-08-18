import { Card } from '@shared/ui'
import type { DetailVM } from '@entities/auction'
import { Field } from './field.component'

interface Props {
  vm: DetailVM
}

/** Payment terms. */
export function PaymentSection({ vm }: Props) {
  const { payment } = vm

  return (
    <Card className="section">
      <h2 className="section__title">Оплата</h2>
      <div className="section__grid">
        <Field label="Форма оплаты">{payment.form}</Field>
        <Field label="Отсрочка">{payment.delay ?? '—'}</Field>
        <Field label="Условия">{payment.condition ?? '—'}</Field>
        <Field label="Валюта">{payment.currency}</Field>
      </div>
    </Card>
  )
}
