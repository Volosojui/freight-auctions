import { RouterProvider } from '@tanstack/react-router'
import { AppProviders } from './providers/app-providers.component'
import { router } from './router/router'

/** Корневой компонент приложения: провайдеры данных + роутинг. */
export function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  )
}
