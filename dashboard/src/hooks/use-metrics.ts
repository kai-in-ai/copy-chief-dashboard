'use client';

import useSWR from 'swr';
import { apiFetch } from '@/lib/utils';

export interface MetricPoint {
  date: string;
  tool: string;
  avg_score: number;
  count: number;
}

export interface MetricsByOffer {
  offer: string;
  tool?: string;
  avg_score: number;
  count: number;
  last_score?: number;
}

export function useMetricsTrend(days: number = 30) {
  return useSWR<MetricPoint[]>(
    `/metrics/trend?days=${days}`,
    apiFetch,
    { refreshInterval: 60_000 }
  );
}

export function useMetricsByOffer() {
  return useSWR<MetricsByOffer[]>(
    '/metrics/by-offer',
    apiFetch,
    { refreshInterval: 60_000 }
  );
}
