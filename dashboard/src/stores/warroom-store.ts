import { create } from 'zustand';
import type { AgentStatus } from '@/stores/agent-store';
import type { DispatchEntry, WorkflowStep } from '@/stores/dispatch-store';
import type { MonitorEvent } from '@/stores/monitor-store';

interface WarRoomFilters {
  agentFilter: string | null;
  offerFilter: string | null;
}

interface WarRoomState {
  agents: AgentStatus[];
  dispatchEntries: DispatchEntry[];
  workflowSteps: WorkflowStep[];
  activityFeed: MonitorEvent[];
  filters: WarRoomFilters;
  setAgents: (agents: AgentStatus[]) => void;
  setDispatchEntries: (entries: DispatchEntry[]) => void;
  setWorkflowSteps: (steps: WorkflowStep[]) => void;
  setActivityFeed: (events: MonitorEvent[]) => void;
  setAgentFilter: (agent: string | null) => void;
  setOfferFilter: (offer: string | null) => void;
  clearFilters: () => void;
}

export const useWarRoomStore = create<WarRoomState>((set) => ({
  agents: [],
  dispatchEntries: [],
  workflowSteps: [],
  activityFeed: [],
  filters: { agentFilter: null, offerFilter: null },
  setAgents: (agents) => set({ agents }),
  setDispatchEntries: (dispatchEntries) => set({ dispatchEntries }),
  setWorkflowSteps: (workflowSteps) => set({ workflowSteps }),
  setActivityFeed: (activityFeed) => set({ activityFeed }),
  setAgentFilter: (agent) => set((s) => ({ filters: { ...s.filters, agentFilter: agent } })),
  setOfferFilter: (offer) => set((s) => ({ filters: { ...s.filters, offerFilter: offer } })),
  clearFilters: () => set({ filters: { agentFilter: null, offerFilter: null } }),
}));
