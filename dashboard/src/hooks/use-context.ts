'use client';

import useSWR from 'swr';
import { apiFetch } from '@/lib/utils';

export interface ContextData {
  rules: { name: string; path: string }[];
  agents: { name: string; handle: string; role: string; path: string }[];
  config: Record<string, unknown> | null;
  mcps: { name: string; status: 'online' | 'offline' | 'unknown' }[];
  active_offer: { context: string | null; mecanismo: Record<string, unknown> | null } | null;
}

export function useContext() {
  return useSWR<ContextData>('/context', apiFetch, { refreshInterval: 60_000 });
}
