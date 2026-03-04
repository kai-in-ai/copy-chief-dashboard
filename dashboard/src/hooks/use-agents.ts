'use client';

import { useAgentStore } from '@/stores/agent-store';
import { useSSE } from '@/hooks/useSSE';
import { useEffect } from 'react';
import type { AgentStatus } from '@/stores/agent-store';

export function useAgents() {
  const { setAgents, setLoading } = useAgentStore();

  const { data, isLoading, isSSE } = useSSE<AgentStatus[]>(
    '/sse/warroom',
    { fallbackPath: '/warroom', fallbackInterval: 10_000 }
  );

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  useEffect(() => {
    if (data) setAgents(data);
  }, [data, setAgents]);

  return { agents: data ?? [], isLoading, isSSE };
}
