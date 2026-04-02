import { create } from 'zustand'

type AuthState = {
  isAuth: boolean
  login: (token: string) => void
  logout: () => void
}

export const useAuth = create<AuthState>((set) => ({
  isAuth: Boolean(localStorage.getItem('token')),

  login: (token) => {
    localStorage.setItem('token', token)
    set({ isAuth: true })
  },

  logout: () => {
    localStorage.removeItem('token')
    set({ isAuth: false })
  },
}))
