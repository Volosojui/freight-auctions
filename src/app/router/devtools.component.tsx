import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

/** Панель devtools — рендерится только в dev-режиме. */
export function DevtoolsPanel() {
  if (!import.meta.env.DEV) return null
  return (
    <>
      <ReactQueryDevtools initialIsOpen={false} />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  )
}
