import { Link } from '@tanstack/react-router'
import { Button } from '@shared/ui'

/** Состояние «страница не найдена» для неизвестного маршрута. */
export function NotFoundPage() {
  return (
    <section className="page state">
      <h1 className="page__title">Страница не найдена</h1>
      <p className="state__text">Запрошенный маршрут не существует.</p>
      <Link to="/">
        <Button>Вернуться к списку</Button>
      </Link>
    </section>
  )
}
