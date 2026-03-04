import { create } from 'zustand';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

interface PendingUpdate {
  task_id: string;
  action: string;
  data: Record<string, unknown>;
}

interface SyncInfo {
  offer: string;
  pending_count: number;
  last_synced: string;
}

interface ExecutionResult {
  processed: number;
  errors: string[];
}

interface ClickUpState {
  syncs: SyncInfo[];
  pendingByOffer: Record<string, PendingUpdate[]>;
  executing: string | null;
  lastResult: ExecutionResult | null;
  lastError: string | null;

  fetchSyncs: () => Promise<void>;
  fetchPending: (offer: string) => Promise<void>;
  executePending: (offer: string) => Promise<ExecutionResult>;
  clearResult: () => void;
}

export const useClickUpStore = create<ClickUpState>((set, get) => ({
  syncs: [],
  pendingByOffer: {},
  executing: null,
  lastResult: null,
  lastError: null,

  fetchSyncs: async () => {
    try {
      const res = await fetch(`${API_BASE}/clickup-syncs`);
      if (!res.ok) return;
      const data = await res.json();
      set({ syncs: data });
    } catch {
      /* ignore */
    }
  },

  fetchPending: async (offer: string) => {
    try {
      const res = await fetch(`${API_BASE}/clickup/${offer}/pending`);
      if (!res.ok) return;
      const data = await res.json();
      set((s) => ({
        pendingByOffer: { ...s.pendingByOffer, [offer]: data.pending || [] },
      }));
    } catch {
      /* ignore */
    }
  },

  executePending: async (offer: string) => {
    set({ executing: offer, lastError: null, lastResult: null });
    try {
      const res = await fetch(`${API_BASE}/clickup/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offer }),
      });
      const result = await res.json();
      // Always-200: check ok field
      if (result.ok === false) {
        set({ executing: null, lastError: result.error || 'Execution failed' });
        return { processed: 0, errors: [result.error || 'Execution failed'] };
      }
      set({ executing: null, lastResult: result });

      // Refresh pending after execution
      get().fetchPending(offer);
      get().fetchSyncs();

      // Cross-store sync: notify offer-store that this offer may have changed
      try {
        const { useOfferStore } = await import('./offer-store');
        useOfferStore.getState().refreshOffer(offer);
      } catch { /* offer-store not available */ }

      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      set({ executing: null, lastError: msg });
      return { processed: 0, errors: [msg] };
    }
  },

  clearResult: () => set({ lastResult: null, lastError: null }),
}));
