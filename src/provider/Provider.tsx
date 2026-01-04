import { useTheme } from '@/store/useTheme'
import type { ReactNode } from 'react'
import { CustomProvider } from 'rsuite'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

//  all provider defined here and wrap the app ⤵
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
      </QueryClientProvider>
    </>
  )
}

export default Provider
