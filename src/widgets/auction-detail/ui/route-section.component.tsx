import { Card } from '@shared/ui'
import type { DetailVM } from '@entities/auction'

interface Props {
  vm: DetailVM
}

/** Full route with every point. Addresses are hidden when the DTO flag is set. */
export function RouteSection({ vm }: Props) {
  return (
    <Card className="section">
      <h2 className="section__title">Маршрут</h2>
      <ol className="route">
        {vm.route.map((point, i) => (
          <li key={i} className="route__point">
            <div className="route__head">
              <span className="route__op">{point.opTypeLabel}</span>
              <span className="route__city">{point.cityFullName}</span>
            </div>
            <div className="route__meta">
              <span>Прибытие: {point.startDate}</span>
              <span>Убытие: {point.endDate}</span>
            </div>
            {point.address !== null ? (
              <div className="route__address">{point.address}</div>
            ) : (
              <div className="route__address route__address--hidden">
                Адрес скрыт
              </div>
            )}
            {point.contact && (
              <div className="route__contact">
                {point.contact.name} · {point.contact.phone}
              </div>
            )}
            <div className="route__cargo">Груз: {point.cargoName}</div>
          </li>
        ))}
      </ol>
    </Card>
  )
}
