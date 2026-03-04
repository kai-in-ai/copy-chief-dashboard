import { create } from 'zustand';

export interface MonitorEvent {
  id: string;
  type: string;
  timestamp: number;
  session_id: string;
  tool_name?: string;
  tool_input?: Record<string, unknown>;
  tool_result?: string;
  is_error?: boolean;
  offer?: string;
  phase?: string;
  data?: Record<string, unknown>;
  semantic_description?: string;
  significance?: 'milestone' | 'significant' | 'noise';
  semantic_data?: {
    agent_name: string | null;
    agent_color: string;
    agent_initial: string;
    verb: string;
    object: string;
    offer_short: string | null;
  };
}

interface MonitorState {
  events: MonitorEvent[];
  connected: boolean;
  addEvent: (event: MonitorEvent) => void;
  addEvents: (events: MonitorEvent[]) => void;
  setConnected: (connected: boolean) => void;
  clearEvents: () => void;
}

const MAX_EVENTS = 500;

// Selector: find the currently-running tool (PreToolUse without matching PostToolUse)
export const selectCurrentTool = (state: MonitorState): MonitorEvent | undefined => {
  const preTools = state.events.filter((e) => e.type === 'PreToolUse');
  const postTools = state.events.filter((e) => e.type === 'PostToolUse');

  for (const pre of preTools) {
    const hasPost = postTools.some(
      (post) =>
        post.tool_name === pre.tool_name &&
        post.session_id === pre.session_id &&
        post.timestamp > pre.timestamp
    );
    if (!hasPost) return pre;
  }
  return undefined;
};

// Selector: get current tool per session
export const selectCurrentToolBySession = (state: MonitorState): Map<string, MonitorEvent> => {
  const map = new Map<string, MonitorEvent>();
  const bySession = new Map<string, MonitorEvent[]>();

  // Group events by session
  for (const e of state.events) {
    if (!e.session_id) continue;
    if (!bySession.has(e.session_id)) bySession.set(e.session_id, []);
    bySession.get(e.session_id)!.push(e);
  }

  // For each session, find running tool
  for (const [sessionId, events] of bySession) {
    const preTools = events.filter((e) => e.type === 'PreToolUse');
    const postTools = events.filter((e) => e.type === 'PostToolUse');

    for (const pre of preTools) {
      const hasPost = postTools.some(
        (post) =>
          post.tool_name === pre.tool_name &&
          post.timestamp > pre.timestamp
      );
      if (!hasPost) {
        map.set(sessionId, pre);
        break;
      }
    }
  }
  return map;
};

export const useMonitorStore = create<MonitorState>((set) => ({
  events: [],
  connected: false,
  addEvent: (event) => set((s) => {
    // Dedup by id
    if (s.events.some((e) => e.id === event.id)) return s;
    const events = [event, ...s.events].slice(0, MAX_EVENTS);
    return { events };
  }),
  addEvents: (events) => set((s) => {
    const existingIds = new Set(s.events.map((e) => e.id));
    const newEvents = events.filter((e) => !existingIds.has(e.id));
    const merged = [...newEvents, ...s.events]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, MAX_EVENTS);
    return { events: merged };
  }),
  setConnected: (connected) => set({ connected }),
  clearEvents: () => set({ events: [] }),
}));
