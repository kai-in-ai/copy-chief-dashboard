import { create } from 'zustand';

export interface TerminalLine {
  timestamp: number;
  session_id: string;
  tool_name: string;
  text: string;
  is_error: boolean;
}

interface TerminalState {
  lines: Map<string, TerminalLine[]>;
  activeSession: string | null;
  viewMode: 'grid' | 'single';
  addLine: (sessionId: string, line: TerminalLine) => void;
  setActiveSession: (sessionId: string | null) => void;
  setViewMode: (mode: 'grid' | 'single') => void;
  clearSession: (sessionId: string) => void;
}

const MAX_LINES = 200;

export const useTerminalStore = create<TerminalState>((set, get) => ({
  lines: new Map(),
  activeSession: null,
  viewMode: 'grid',

  addLine: (sessionId, line) => {
    const lines = new Map(get().lines);
    const existing = lines.get(sessionId) || [];
    const updated = [...existing, line].slice(-MAX_LINES);
    lines.set(sessionId, updated);
    set({ lines });
  },

  setActiveSession: (activeSession) => set({ activeSession }),
  setViewMode: (viewMode) => set({ viewMode }),

  clearSession: (sessionId) => {
    const lines = new Map(get().lines);
    lines.delete(sessionId);
    set({ lines });
  },
}));
