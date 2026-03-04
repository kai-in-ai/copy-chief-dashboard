'use client';

import { useAgents } from '@/hooks/use-agents';
import { useDispatchQueue } from '@/hooks/use-dispatch-queue';
import { useMonitorStore } from '@/stores/monitor-store';
import { useWarRoomStore } from '@/stores/warroom-store';
import useSWR from 'swr';
import { apiFetch } from '@/lib/utils';

interface ActivityItem {
  timestamp: number;
  agent_name: string | null;
  agent_color: string;
  agent_initial: string;
  action: string;
  offer: string | null;
  significance: 'milestone' | 'significant';
}

interface WarRoomResponse {
  activity: ActivityItem[];
  workflow_steps?: Array<{
    id: string;
    offer: string;
    action: string;
    agent_id: string;
    status: string;
    phase: string;
  }>;
  dispatch_summary?: Record<string, number>;
}

export function useWarRoom() {
  const { agents, isLoading: agentsLoading, isSSE: agentsSSE } = useAgents();
  const { entries, workflowSteps, isLoading: dispatchLoading, isSSE: dispatchSSE } = useDispatchQueue();
  const monitorEvents = useMonitorStore((s) => s.events);
  const { filters, setAgentFilter, setOfferFilter, clearFilters } = useWarRoomStore();

  // Fetch semantic activity from /warroom endpoint (polls every 10s)
  const { data: warRoomData } = useSWR<WarRoomResponse>('/warroom', apiFetch, {
    refreshInterval: 10_000,
    revalidateOnFocus: false,
  });

  // Build activity feed: prefer server semantic data, supplement with enriched monitor events
  const semanticActivity = (warRoomData?.activity || []).map((item, idx) => ({
    id: `activity-${item.timestamp}-${idx}`,
    type: 'Activity' as const,
    timestamp: item.timestamp,
    session_id: '',
    semantic_description: item.action,
    significance: item.significance,
    semantic_data: {
      agent_name: item.agent_name,
      agent_color: item.agent_color,
      agent_initial: item.agent_initial,
      verb: '',
      object: '',
      offer_short: item.offer,
    },
    offer: item.offer || undefined,
  }));

  // Only include monitor events that have semantic_data (enriched by server)
  const enrichedMonitor = monitorEvents
    .filter(e => e.semantic_data?.agent_name || e.semantic_description)
    .slice(0, 30);

  // Merge: semantic activity first, then enriched monitor events (deduped by timestamp)
  const seenTimestamps = new Set(semanticActivity.map(a => a.timestamp));
  const merged = [
    ...semanticActivity,
    ...enrichedMonitor.filter(e => !seenTimestamps.has(e.timestamp)),
  ].sort((a, b) => b.timestamp - a.timestamp).slice(0, 50);

  const activityFeed = merged.length > 0 ? merged : monitorEvents.slice(0, 20);

  // Merge warroom workflow_steps into dispatch data for richer kanban
  const warRoomWorkflowSteps = (warRoomData?.workflow_steps || []).map(s => ({
    id: s.id,
    offer: s.offer,
    action: s.action,
    agent_id: s.agent_id,
    status: s.status,
    phase: s.phase,
  }));
  const allWorkflowSteps = workflowSteps.length > 0
    ? workflowSteps
    : warRoomWorkflowSteps;

  return {
    agents,
    entries,
    workflowSteps: allWorkflowSteps,
    activityFeed,
    filters,
    setAgentFilter,
    setOfferFilter,
    clearFilters,
    isLoading: agentsLoading || dispatchLoading,
    isSSE: agentsSSE && dispatchSSE,
  };
}
