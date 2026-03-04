import { create } from 'zustand';

export interface HelixPhase {
  name: string;
  status: 'pending' | 'active' | 'passed' | 'failed';
  started_at: string | null;
  completed_at: string | null;
  tools_used: string[];
  tools_missing: string[];
}

interface HelixState {
  phases: HelixPhase[];
  currentPhase: string;
  gates: Record<string, boolean>;
  loading: boolean;
  setPhases: (phases: HelixPhase[]) => void;
  setCurrentPhase: (phase: string) => void;
  setGates: (gates: Record<string, boolean>) => void;
  setLoading: (loading: boolean) => void;
}

export const useHelixStore = create<HelixState>((set) => ({
  phases: [],
  currentPhase: 'IDLE',
  gates: {},
  loading: false,
  setPhases: (phases) => set({ phases, loading: false }),
  setCurrentPhase: (currentPhase) => set({ currentPhase }),
  setGates: (gates) => set({ gates }),
  setLoading: (loading) => set({ loading }),
}));

// Computed helpers
export function getPercentComplete(phases: HelixPhase[]): number {
  if (phases.length === 0) return 0;
  const passed = phases.filter((p) => p.status === 'passed').length;
  return Math.round((passed / phases.length) * 100);
}

export function getActivePhaseIndex(phases: HelixPhase[]): number {
  return phases.findIndex((p) => p.status === 'active');
}
