import { create } from 'zustand';

export interface AgentStatus {
  name: string;
  handle: string;
  role: string;
  color: string;
  initial: string;
  status: 'idle' | 'working' | 'error';
  current_task: string | null;
  assigned_offer: string | null;
  last_seen: string | null;
}

interface AgentState {
  agents: AgentStatus[];
  loading: boolean;
  setAgents: (agents: AgentStatus[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useAgentStore = create<AgentState>((set) => ({
  agents: [],
  loading: true,
  setAgents: (agents) => set({ agents, loading: false }),
  setLoading: (loading) => set({ loading }),
}));
