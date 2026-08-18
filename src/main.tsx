import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from '@app/index'
import { initTheme } from '@shared/lib/theme'
import './app/styles/global.css'

/**
 * The app is mock-only (no real backend), so MSW runs in every environment —
 * dev, tests and the production deploy. The worker is started (and awaited)
 * before the first render so it controls the page and intercepts API requests
 * instead of letting them hit the network.
 */
async function enableMocking(): Promise<void> {
  const { worker } = await import('@shared/api/mock')
  await worker.start({ onUnhandledRequest: 'bypass' })
}

function mount(): void {
  initTheme()
  const rootElement = document.getElementById('root')
  if (!rootElement) throw new Error('Root element #root not found')

  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

enableMocking().then(mount)
