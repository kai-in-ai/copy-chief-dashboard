'use client';

import { useHelix } from '@/hooks/use-helix';
import { useOfferStore } from '@/stores/offer-store';
import { useHelixStore, getPercentComplete } from '@/stores/helix-store';
import { useOffers } from '@/hooks/use-offers';
import { Badge } from '@/components/ui/badge';
import { ProgressBar } from '@/components/ui/progress-bar';
import { HELIXMermaid } from '@/components/helix/HELIXMermaid';
import { HELIXPipelinePanel } from '@/components/helix/HELIXPipelinePanel';
import { PhaseDetail } from '@/components/helix/PhaseDetail';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function HelixPage() {
  const { offers } = useOffers();
  const { selectedOffer, selectOffer } = useOfferStore();
  const { phases, currentPhase, gates } = useHelixStore();
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);
  const [showMermaid, setShowMermaid] = useState(false);

  useHelix();

  const pct = getPercentComplete(phases);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-mono text-[var(--hud-text)]">HELIX Pipeline</h1>
        <div className="flex items-center gap-2">
          {phases.length > 0 && (
            <button
              onClick={() => setShowMermaid(!showMermaid)}
              className="text-[10px] font-mono px-2 py-1 rounded border border-[var(--hud-border)] text-[var(--hud-text-dim)] hover:text-[var(--hud-text)] hover:border-[var(--hud-text-dim)] transition-colors"
            >
              {showMermaid ? 'Pills' : 'Diagram'}
            </button>
          )}
          <select
            value={selectedOffer || ''}
            onChange={(e) => selectOffer(e.target.value || null)}
            className="text-xs font-mono bg-[var(--hud-surface)] border border-[var(--hud-border)] text-[var(--hud-text)] rounded px-2 py-1"
          >
            <option value="">Select offer...</option>
            {offers.map((o) => (
              <option key={`${o.nicho}/${o.name}`} value={`${o.nicho}/${o.name}`}>{o.nicho}/{o.name}</option>
            ))}
          </select>
        </div>
      </div>

      {!selectedOffer ? (
        <div className="flex items-center justify-center py-16">
          <p className="text-sm font-mono text-[var(--hud-text-dim)]">Select an offer to view HELIX pipeline</p>
        </div>
      ) : phases.length === 0 ? (
        <div className="flex items-center justify-center py-16">
          <p className="text-sm font-mono text-[var(--hud-text-dim)] animate-pulse">Loading pipeline...</p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-4">
            <ProgressBar value={pct} className="flex-1" />
            <Badge variant={pct === 100 ? 'passed' : 'active'}>
              {pct}% complete
            </Badge>
          </div>

          <ErrorBoundary section="HELIX Pipeline">
          {showMermaid ? (
            <HELIXMermaid phases={phases} />
          ) : (
            <HELIXPipelinePanel
              phases={phases}
              selectedPhase={selectedPhase}
              onPhaseSelect={setSelectedPhase}
            />
          )}

          </ErrorBoundary>

          {/* Gates status */}
          <div className="flex gap-4">
            {Object.entries(gates).map(([name, passed]) => (
              <div key={name} className="flex items-center gap-1.5">
                <span className={cn('w-2 h-2 rounded-full', passed ? 'bg-emerald-400' : 'bg-zinc-600')} />
                <span className="text-[10px] font-mono text-[var(--hud-text-dim)] uppercase">{name} gate</span>
              </div>
            ))}
          </div>

          {/* Phase detail */}
          {selectedPhase !== null && phases[selectedPhase] && (
            <PhaseDetail phase={phases[selectedPhase]} />
          )}
        </>
      )}
    </div>
  );
}
