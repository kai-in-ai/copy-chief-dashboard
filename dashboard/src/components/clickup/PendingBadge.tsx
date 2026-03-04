'use client';

import { useEffect } from 'react';
import useSWR from 'swr';
import { apiFetch } from '@/lib/utils';

interface PendingSummary {
  total_pending: number;
}

export function PendingBadge() {
  const { data } = useSWR<PendingSummary>(
    '/clickup/pending-summary',
    apiFetch,
    { refreshInterval: 30_000 }
  );

  const count = data?.total_pending || 0;
  if (count === 0) return null;

  return (
    <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[9px] font-mono font-bold rounded-full bg-[var(--status-warning-bg)] text-[var(--status-warning)] border border-[var(--status-warning-border)]">
      {count}
    </span>
  );
}
