import { create } from 'zustand'

type Theme = 'dark' | 'light'

type ThemeState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

export const useTheme = create<ThemeState>((set) => ({
  theme: (localStorage.getItem('theme') as Theme) || 'light',
  setTheme: (theme: Theme) => set({ theme }),
}))

// Add theme to local storage
useTheme.subscribe(({ theme }) => {
  localStorage.setItem('theme', theme)
})
