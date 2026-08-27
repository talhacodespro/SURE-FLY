import { create } from 'zustand'

type AuthState = {
  isAuth: boolean

  token: string | null

  login: (token: string) => void

  logout: () => void
}

/* =========================================
   Initial Token
========================================= */

const token = localStorage.getItem('token')

/* =========================================
   Auth Store
========================================= */

export const useAuth = create<AuthState>((set) => ({
  token,

  isAuth: Boolean(token),

  login: (token) => {
    localStorage.setItem('token', token)

    set({
      token,
      isAuth: true,
    })
  },

  logout: () => {
    localStorage.removeItem('token')

    set({
      token: null,
      isAuth: false,
    })
  },
}))
