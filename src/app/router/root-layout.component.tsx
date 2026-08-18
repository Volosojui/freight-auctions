import { Link, Outlet } from '@tanstack/react-router'
import { ToastHost, ThemeToggle } from '@shared/ui'
import { DevtoolsPanel } from './devtools.component'

/** Корневой layout приложения: шапка, контентная область и хост тостов. */
export function RootLayout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__inner">
          <Link to="/" className="app-header__brand">
            Грузовые аукционы
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="app-main">
        <div className="app-main__inner">
          <Outlet />
        </div>
      </main>

      <ToastHost />
      <DevtoolsPanel />
    </div>
  )
}
