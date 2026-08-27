/**
 * Global providers wrapper.
 * Central place for UI theme (RSuite) + data fetching cache (React Query).
 */
import { useTheme } from '@/store/useTheme'
import type { ReactNode } from 'react'
import { CustomProvider } from 'rsuite'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const Provider = ({ children }: { children: ReactNode }) => {
  const { theme } = useTheme()
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
      mutations: {
        retry: 0,
      },
    },
  })
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <CustomProvider theme={theme} disableRipple>
          {children}
        </CustomProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  )
}

export default Provider
