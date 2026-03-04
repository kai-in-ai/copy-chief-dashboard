'use client';

import { useDispatchStore } from '@/stores/dispatch-store';
import { useSSE } from '@/hooks/useSSE';
import { useEffect } from 'react';
import type { DispatchEntry, WorkflowStep } from '@/stores/dispatch-store';

interface DispatchQueueResponse {
  queues: DispatchEntry[];
  workflow_steps: WorkflowStep[];
}

export function useDispatchQueue() {
  const { setEntries, setWorkflowSteps, setLoading } = useDispatchStore();

  const { data, isLoading, isSSE } = useSSE<DispatchQueueResponse>(
    '/sse/dispatch-queues',
    { fallbackPath: '/dispatch-queues', fallbackInterval: 10_000 }
  );

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  useEffect(() => {
    if (data) {
      setEntries(data.queues || []);
      setWorkflowSteps(data.workflow_steps || []);
    }
  }, [data, setEntries, setWorkflowSteps]);

  return {
    entries: data?.queues ?? [],
    workflowSteps: data?.workflow_steps ?? [],
    isLoading,
    isSSE,
  };
}
