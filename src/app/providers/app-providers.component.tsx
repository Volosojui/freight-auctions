import { useState, type ReactNode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { createQueryClient } from './query-client'

interface AppProvidersProps {
  children: ReactNode
}

/** Провайдеры приложения. QueryClient создаётся один раз на монтирование. */
export function AppProviders({ children }: AppProvidersProps) {
  const [queryClient] = useState(createQueryClient)

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
