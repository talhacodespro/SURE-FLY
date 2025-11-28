import { useTheme } from '@/store/useTheme'
import type { ReactNode } from 'react'
import { CustomProvider } from 'rsuite'

//  all provider defined here and wrap the app ⤵
const Provider = ({ children }: { children: ReactNode }) => {
  const { theme } = useTheme()
  return (
    <>
      <CustomProvider theme={theme} disableRipple>
        {children}
      </CustomProvider>
    </>
  )
}

export default Provider
