'use client';

import { useMemo } from 'react';
import { useOffers } from '@/hooks/use-offers';
import { DnDKanbanBoard } from '@/components/kanban/DnDKanbanBoard';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { phaseToColumn } from '@/lib/utils';
import type { OfferStatus } from '@/stores/offer-store';

const COLUMNS = ['IDLE', 'RESEARCH', 'BRIEFING', 'PRODUCTION'] as const;

export default function KanbanPage() {
  const { offers, isLoading } = useOffers();

  const activeOffers = useMemo(() => offers.filter(o => o.status !== 'standby' && o.status !== 'archived'), [offers]);
  const standbyOffers = useMemo(() => offers.filter(o => o.status === 'standby'), [offers]);

  const grouped = useMemo(() => {
    const map: Record<string, OfferStatus[]> = {};
    for (const col of COLUMNS) map[col] = [];
    for (const offer of activeOffers) {
      const col = phaseToColumn(offer.phase);
      if (map[col]) map[col].push(offer);
      else map.IDLE.push(offer);
    }
    return map;
  }, [activeOffers]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-mono text-[var(--hud-text)]">Kanban</h1>
        <span className="text-[10px] font-mono text-[var(--hud-text-dim)]">
          Drag offers between columns to change phase
        </span>
      </div>

      {isLoading ? (
        <p className="text-xs font-mono text-[var(--hud-text-dim)] animate-pulse">Loading offers...</p>
      ) : (
        <>
          <ErrorBoundary section="Kanban DnD">
            <DnDKanbanBoard grouped={grouped} />
          </ErrorBoundary>

          {standbyOffers.length > 0 && (
            <div className="mt-4 p-4 rounded border border-[var(--hud-border)] bg-[var(--hud-surface)] opacity-50">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono font-bold text-[var(--hud-text-dim)]">STANDBY</span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[var(--hud-bg)] text-[var(--hud-text-dim)]">
                  {standbyOffers.length}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {standbyOffers.map(o => (
                  <span key={`${o.nicho}/${o.name}`} className="text-[10px] font-mono px-2 py-1 rounded bg-[var(--hud-bg)] border border-[var(--hud-border)] text-[var(--hud-text-dim)]">
                    {o.nicho}/{o.name}
                    <span className="ml-1 opacity-40">{o.phase}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
