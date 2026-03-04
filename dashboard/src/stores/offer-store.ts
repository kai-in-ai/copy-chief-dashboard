import { create } from 'zustand';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

export interface OfferDeliverables {
  vsl: number;
  lp: number;
  criativos: number;
  emails: number;
}

export interface OfferStatus {
  name: string;
  nicho: string;
  status?: 'active' | 'standby' | 'archived';
  phase: string;
  mecanismo_state: string;
  production_count: number;
  deliverables?: OfferDeliverables;
  active_agent?: string | null;
  last_activity?: number;
  avg_quality: number;
  rmbc?: { digerivel?: number; unico?: number; provavel?: number; conectado?: number };
  blind_critic_score?: number;
  est_score?: number;
}

// External listener pattern — notify without React re-render (AIOS pattern)
type OfferChangeListener = (offer: string, phase: string) => void;
const offerChangeListeners = new Set<OfferChangeListener>();

export const onOfferChange = (fn: OfferChangeListener) => {
  offerChangeListeners.add(fn);
  return () => { offerChangeListeners.delete(fn); };
};

// Race condition guard for concurrent operations
const operationsInProgress = new Set<string>();

interface OfferState {
  offers: OfferStatus[];
  selectedOffer: string | null;
  loading: boolean;
  moveError: string | null;
  setOffers: (offers: OfferStatus[]) => void;
  selectOffer: (offer: string | null) => void;
  setLoading: (loading: boolean) => void;
  moveOffer: (offerId: string, newPhase: string) => Promise<{ ok: boolean; error?: string }>;
  refreshOffer: (offer: string) => void;
}

export const useOfferStore = create<OfferState>((set, get) => ({
  offers: [],
  selectedOffer: null,
  loading: false,
  moveError: null,

  setOffers: (offers) => {
    const prev = get().offers;
    set({ offers, loading: false });
    // Notify external listeners on phase changes
    for (const offer of offers) {
      const key = `${offer.nicho}/${offer.name}`;
      const prevOffer = prev.find((o) => `${o.nicho}/${o.name}` === key);
      if (prevOffer && prevOffer.phase !== offer.phase) {
        offerChangeListeners.forEach((fn) => fn(key, offer.phase));
      }
    }
  },

  selectOffer: (offer) => set({ selectedOffer: offer }),
  setLoading: (loading) => set({ loading }),

  moveOffer: async (offerId, newPhase) => {
    // Race guard — prevent concurrent moves on same offer
    if (operationsInProgress.has(offerId)) {
      return { ok: false, error: 'Move already in progress' };
    }
    operationsInProgress.add(offerId);
    set({ moveError: null });

    // Optimistic update — move immediately in UI
    const prevOffers = get().offers;
    set({
      offers: prevOffers.map((o) =>
        `${o.nicho}/${o.name}` === offerId ? { ...o, phase: newPhase } : o
      ),
    });

    try {
      const res = await fetch(`${API_BASE}/offers/move`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offer: offerId, newPhase }),
      });
      const result = await res.json();
      if (!result.ok) {
        // Snap-back on failure
        set({ offers: prevOffers, moveError: result.error || 'Move failed' });
        return { ok: false, error: result.error };
      }
      // Notify external listeners
      offerChangeListeners.forEach((fn) => fn(offerId, newPhase));
      return { ok: true };
    } catch (err) {
      // Snap-back on network error
      const msg = err instanceof Error ? err.message : 'Network error';
      set({ offers: prevOffers, moveError: msg });
      return { ok: false, error: msg };
    } finally {
      operationsInProgress.delete(offerId);
    }
  },

  refreshOffer: (_offer: string) => {
    // SSE will auto-refresh — this is a manual trigger for cross-store sync
    // No-op when SSE is active; used by clickup-store after sync execution
  },
}));
