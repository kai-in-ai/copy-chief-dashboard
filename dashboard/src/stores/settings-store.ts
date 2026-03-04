import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  theme: 'dark' | 'light' | 'system';
  autoRefresh: boolean;
  refreshInterval: number;
  showStandbyOffers: boolean;
  setTheme: (theme: 'dark' | 'light' | 'system') => void;
  setAutoRefresh: (enabled: boolean) => void;
  setRefreshInterval: (ms: number) => void;
  setShowStandbyOffers: (show: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'dark',
      autoRefresh: true,
      refreshInterval: 30_000,
      showStandbyOffers: false,
      setTheme: (theme) => set({ theme }),
      setAutoRefresh: (autoRefresh) => set({ autoRefresh }),
      setRefreshInterval: (refreshInterval) => set({ refreshInterval }),
      setShowStandbyOffers: (showStandbyOffers) => set({ showStandbyOffers }),
    }),
    { name: 'copy-chief-settings' }
  )
);
