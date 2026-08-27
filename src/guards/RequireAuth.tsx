/**
 * Route guard component.
 * Redirects unauthenticated users to the login page.
 */
import { useAuth } from '@/store/useAuth'
import type { ReactNode } from 'react'
import { Navigate } from 'react-router'

const RequireAuth = ({ children }: { children: ReactNode }) => {
  const isAuth = useAuth((state) => state.isAuth)

  if (!isAuth) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export default RequireAuth
