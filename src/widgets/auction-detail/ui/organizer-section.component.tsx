import { Card } from '@shared/ui'
import type { DetailVM } from '@entities/auction'
import { Field } from './field.component'

interface Props {
  vm: DetailVM
}

/** Organizer + contacts. Contacts are hidden when the DTO flag is set. */
export function OrganizerSection({ vm }: Props) {
  const { organizer, contacts } = vm

  return (
    <Card className="section">
      <h2 className="section__title">Организатор</h2>
      <div className="section__grid">
        <Field label="Организация">{organizer.name}</Field>
        <Field label="ИНН">{organizer.inn}</Field>
        <Field label="КПП">{organizer.kpp}</Field>
      </div>

      {contacts === null ? (
        <p className="section__note">Контакты скрыты организатором.</p>
      ) : contacts.length === 0 ? (
        <p className="section__note">Контакты не указаны.</p>
      ) : (
        <ul className="contacts">
          {contacts.map((c, i) => (
            <li key={i} className="contacts__item">
              {c.name && <span>{c.name}</span>}
              {c.phone && <span>{c.phone}</span>}
              {c.workPhone && <span>{c.workPhone}</span>}
              {c.email && <span>{c.email}</span>}
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
