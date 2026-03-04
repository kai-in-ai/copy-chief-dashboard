'use client';

import { useMemo } from 'react';
import { useOfferStore } from '@/stores/offer-store';
import { Badge } from '@/components/ui/badge';
import { ScoreBadge } from '@/components/ui/score-badge';
import { ErrorBoundary } from '@/components/ui/error-boundary';

type Priority = 'must' | 'should' | 'could' | 'wont';

const PRIORITY_LABELS: Record<Priority, string> = {
  must: 'Must Have',
  should: 'Should Have',
  could: 'Could Have',
  wont: "Won't Have",
};

const PRIORITY_COLORS: Record<Priority, string> = {
  must: 'border-red-500/30 bg-red-500/5',
  should: 'border-yellow-500/30 bg-yellow-500/5',
  could: 'border-blue-500/30 bg-blue-500/5',
  wont: 'border-[var(--hud-border)] bg-[var(--hud-surface)] opacity-50',
};

function classifyPriority(offer: { status?: string; phase: string; mecanismo_state: string }): Priority {
  if (offer.status === 'standby' || offer.status === 'archived') return 'wont';
  if (offer.mecanismo_state === 'APPROVED' || offer.mecanismo_state === 'VALIDATED') return 'must';
  if (offer.phase === 'research' || offer.phase === 'briefing') return 'should';
  return 'could';
}

export default function RoadmapPage() {
  const offers = useOfferStore((s) => s.offers);

  const grouped = useMemo(() => {
    const groups: Record<Priority, typeof offers> = { must: [], should: [], could: [], wont: [] };
    for (const o of offers) {
      const priority = classifyPriority(o);
      groups[priority].push(o);
    }
    return groups;
  }, [offers]);

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-mono text-[var(--hud-text)]">Roadmap</h1>

      <ErrorBoundary section="Roadmap">
        <div className="space-y-4">
          {(Object.keys(PRIORITY_LABELS) as Priority[]).map(priority => {
            const items = grouped[priority];
            if (items.length === 0) return null;
            return (
              <div key={priority}>
                <h2 className="text-xs font-mono text-[var(--hud-text-dim)] uppercase tracking-wider mb-2">
                  {PRIORITY_LABELS[priority]} ({items.length})
                </h2>
                <div className="space-y-2">
                  {items.map(o => (
                    <div
                      key={`${o.nicho}/${o.name}`}
                      className={`border rounded p-3 ${PRIORITY_COLORS[priority]}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono text-[var(--hud-text)]">{o.name}</span>
                          <Badge variant="default">{o.nicho}</Badge>
                        </div>
                        {o.avg_quality > 0 && <ScoreBadge score={o.avg_quality} />}
                      </div>
                      <div className="flex items-center gap-3 text-[10px] font-mono text-[var(--hud-text-dim)]">
                        <span>Phase: {o.phase}</span>
                        <span>Mec: {o.mecanismo_state}</span>
                        {o.deliverables && (
                          <span>
                            VSL:{o.deliverables.vsl} LP:{o.deliverables.lp} Ads:{o.deliverables.criativos} Email:{o.deliverables.emails}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </ErrorBoundary>

      <p className="text-[10px] font-mono text-[var(--hud-text-dim)]">
        {offers.length} offers — Priority based on phase + mecanismo state
      </p>
    </div>
  );
}
