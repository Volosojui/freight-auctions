import { QueryClient } from '@tanstack/react-query'

/** Единый QueryClient приложения. Серверное состояние живёт только здесь. */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  })
}
