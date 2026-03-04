'use client';

import useSWR from 'swr';
import { apiFetch, cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ScoreBadge } from '@/components/ui/score-badge';

interface Journey {
  offer: string;
  deliverable: string;
  iterations: number;
  last_score: number;
  status: string;
  started_at?: string;
  completed_at?: string;
}

export function JourneysSection() {
  const { data: journeys = [] } = useSWR<Journey[]>('/journeys', apiFetch, { refreshInterval: 120_000 });

  if (journeys.length === 0) {
    return (
      <div>
        <h2 className="text-sm font-mono text-[var(--hud-text)] mb-3">Production Journeys</h2>
        <div className="flex flex-col items-center justify-center py-8 text-[var(--hud-text-dim)] border border-[var(--hud-border)] rounded bg-[var(--hud-surface)]">
          <p className="text-xs font-mono mb-1">No production journeys yet</p>
          <p className="text-[10px] opacity-50">Journeys track iterative production loops per deliverable</p>
        </div>
      </div>
    );
  }

  const grouped = journeys.reduce<Record<string, Journey[]>>((acc, j) => {
    if (!acc[j.offer]) acc[j.offer] = [];
    acc[j.offer].push(j);
    return acc;
  }, {});

  return (
    <div>
      <h2 className="text-sm font-mono text-[var(--hud-text)] mb-3">Production Journeys</h2>
      <div className="space-y-3">
        {Object.entries(grouped).map(([offer, items]) => (
          <div key={offer} className="border border-[var(--hud-border)] rounded overflow-hidden">
            <div className="px-3 py-2 bg-[var(--hud-surface)] border-b border-[var(--hud-border)]">
              <Badge variant="info">{offer}</Badge>
            </div>
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="bg-[var(--hud-surface)]">
                  <th className="text-left px-3 py-1.5 text-[var(--hud-text-dim)]">Deliverable</th>
                  <th className="text-right px-3 py-1.5 text-[var(--hud-text-dim)]">Iterations</th>
                  <th className="text-right px-3 py-1.5 text-[var(--hud-text-dim)]">Score</th>
                  <th className="text-right px-3 py-1.5 text-[var(--hud-text-dim)]">Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map((j, i) => (
                  <tr key={i} className="border-t border-[var(--hud-border)]">
                    <td className="px-3 py-1.5 text-[var(--hud-text)]">{j.deliverable}</td>
                    <td className="px-3 py-1.5 text-right text-[var(--hud-text-dim)]">{j.iterations}</td>
                    <td className="px-3 py-1.5 text-right">
                      <span className={cn(
                        j.last_score >= 8 ? 'text-emerald-400' : j.last_score >= 7 ? 'text-yellow-400' : 'text-red-400'
                      )}>
                        {j.last_score.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-3 py-1.5 text-right">
                      <Badge variant={j.status === 'approved' ? 'passed' : j.status === 'escalated' ? 'failed' : 'active'}>
                        {j.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}
