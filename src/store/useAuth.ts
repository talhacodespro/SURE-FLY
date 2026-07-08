import { create } from 'zustand'

type AuthState = {
  isAuth: boolean
  login: (token: string, rememberMe?: boolean) => void
  logout: () => void
}

const getStoredToken = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token')
}

export const useAuth = create<AuthState>((set) => ({
  isAuth: Boolean(getStoredToken()),

  login: (token, rememberMe = false) => {
    localStorage.removeItem('token')
    sessionStorage.removeItem('token')

    if (rememberMe) {
      localStorage.setItem('token', token)
    } else {
      sessionStorage.setItem('token', token)
    }

    set({ isAuth: true })
  },

  logout: () => {
    localStorage.removeItem('token')
    sessionStorage.removeItem('token')
    set({ isAuth: false })
  },
}))
