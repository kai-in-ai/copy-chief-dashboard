'use client';

import useSWR from 'swr';
import { apiFetch } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface Pattern {
  id: string;
  title: string;
  sequence: string[];
  count: number;
  status: string;
  benefit: string;
}

export function PatternsSection() {
  const { data: patterns = [] } = useSWR<Pattern[]>('/patterns', apiFetch, { refreshInterval: 120_000 });

  if (patterns.length === 0) {
    return (
      <div>
        <h2 className="text-sm font-mono text-[var(--hud-text)] mb-3">Learned Patterns</h2>
        <div className="flex flex-col items-center justify-center py-8 text-[var(--hud-text-dim)] border border-[var(--hud-border)] rounded bg-[var(--hud-surface)]">
          <p className="text-xs font-mono mb-1">No patterns detected yet</p>
          <p className="text-[10px] opacity-50">Patterns emerge after running validation tools multiple times</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-sm font-mono text-[var(--hud-text)] mb-3">Learned Patterns</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {patterns.map((p) => (
          <div
            key={p.id}
            className="border border-[var(--hud-border)] rounded p-3 bg-[var(--hud-surface)]"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-[var(--hud-text)] font-bold">{p.title}</span>
              <Badge variant={p.status === 'learned' ? 'passed' : 'active'}>
                {p.count}x
              </Badge>
            </div>
            <div className="flex items-center gap-1 mb-2">
              {p.sequence.map((step, i) => (
                <div key={i} className="flex items-center gap-1">
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-[var(--hud-accent-bg)] text-[var(--hud-accent)]">
                    {step.split('__').pop()}
                  </span>
                  {i < p.sequence.length - 1 && (
                    <span className="text-[10px] text-[var(--hud-text-dim)]">&rarr;</span>
                  )}
                </div>
              ))}
            </div>
            <p className="text-[10px] font-mono text-[var(--hud-text-dim)]">{p.benefit}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
