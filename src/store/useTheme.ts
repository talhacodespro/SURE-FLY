import { create } from 'zustand'

type Theme = 'dark' | 'light'

type ThemeState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

export const useTheme = create<ThemeState>()((set) => ({
  theme: 'dark',
  setTheme: (theme: Theme) => set({ theme }),
}))
