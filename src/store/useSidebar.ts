import { create } from 'zustand'

type SidebarState = {
  sidebar: boolean
  setSidebar: (sidebar: boolean) => void
}

export const useSidebar = create<SidebarState>((set) => ({
  sidebar: false,
  setSidebar: (sidebar: boolean) => set({ sidebar }),
}))
