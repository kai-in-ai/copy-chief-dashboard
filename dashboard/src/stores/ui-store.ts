import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  sidebarCollapsed: boolean;
  activeView: string;
  toggleSidebar: () => void;
  setActiveView: (view: string) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      activeView: 'monitor',
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setActiveView: (view) => set({ activeView: view }),
    }),
    { name: 'copy-chief-ui' }
  )
);
