import { Link, type ErrorComponentProps } from '@tanstack/react-router'
import { Button } from '@shared/ui'

/** Корневой fallback ошибок рендера маршрутов вместо белого экрана. */
export function RootErrorBoundary({ error }: ErrorComponentProps) {
  const message = error instanceof Error ? error.message : String(error)

  return (
    <section className="page state">
      <h1 className="page__title">Что-то пошло не так</h1>
      <p className="state__text">{message}</p>
      <Link to="/">
        <Button>Вернуться к списку</Button>
      </Link>
    </section>
  )
}
