import { create } from 'zustand';

export interface DispatchEntry {
  id: string;
  offer: string;
  agent_id: string;
  model: string;
  status: 'pending' | 'dispatched' | 'completed' | 'failed' | 'skipped';
  task_summary: string;
  parallel_group: string | null;
  created_at: string;
  source: string;
}

export interface WorkflowStep {
  id: string;
  offer: string;
  action: string;
  agent_id: string;
  status: string;
  phase: string;
}

interface DispatchState {
  entries: DispatchEntry[];
  workflowSteps: WorkflowStep[];
  loading: boolean;
  setEntries: (entries: DispatchEntry[]) => void;
  setWorkflowSteps: (steps: WorkflowStep[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useDispatchStore = create<DispatchState>((set) => ({
  entries: [],
  workflowSteps: [],
  loading: true,
  setEntries: (entries) => set({ entries, loading: false }),
  setWorkflowSteps: (workflowSteps) => set({ workflowSteps }),
  setLoading: (loading) => set({ loading }),
}));
