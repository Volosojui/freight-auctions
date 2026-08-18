import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from '@app/index'
import './app/styles/global.css'

/**
 * Включаем MSW только в dev. Динамический импорт гарантирует, что мок-код и
 * данные не попадают в production-бандл (ветка недостижима при DEV === false).
 */
async function enableMocking(): Promise<void> {
  if (!import.meta.env.DEV) return
  const { worker } = await import('@shared/api/mock')
  await worker.start({ onUnhandledRequest: 'bypass' })
}

function mount(): void {
  const rootElement = document.getElementById('root')
  if (!rootElement) throw new Error('Root element #root not found')

  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

enableMocking().then(mount)
