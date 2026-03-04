'use client';

import { useSSE } from '@/hooks/useSSE';
import { cn } from '@/lib/utils';

interface SynapseState {
  phase: string;
  bracket: string;
  rules_loaded: number;
  layers: string[];
  offer: string;
  estimated_tokens?: number;
}

export function SynapseWidget() {
  const { data: synapse } = useSSE<SynapseState>(
    '/sse/synapse',
    { fallbackPath: '/synapse', fallbackInterval: 10_000 }
  );

  if (!synapse || !synapse.phase) return null;

  const bracketColor = {
    FRESH: 'text-emerald-400',
    WARM: 'text-amber-400',
    HOT: 'text-red-400',
  }[synapse.bracket] || 'text-zinc-400';

  return (
    <div className="border border-[var(--hud-border)] rounded p-3 bg-[var(--hud-surface)]">
      <p className="text-[10px] font-mono text-[var(--hud-text-dim)] uppercase tracking-wider mb-2">SYNAPSE Engine</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[10px] font-mono">
        <div>
          <p className="text-[var(--hud-text-dim)]">Phase</p>
          <p className="text-[var(--hud-accent)]">{synapse.phase}</p>
        </div>
        <div>
          <p className="text-[var(--hud-text-dim)]">Bracket</p>
          <p className={bracketColor}>{synapse.bracket}</p>
        </div>
        <div>
          <p className="text-[var(--hud-text-dim)]">Rules</p>
          <p className="text-[var(--hud-text)]">{synapse.rules_loaded}</p>
        </div>
        <div>
          <p className="text-[var(--hud-text-dim)]">Layers</p>
          <p className="text-[var(--hud-text)]">{synapse.layers?.length || 0}</p>
        </div>
      </div>
      {synapse.layers && synapse.layers.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {synapse.layers.map((l) => (
            <span key={l} className="px-1.5 py-0.5 rounded bg-[var(--hud-bg)] text-[9px] font-mono text-[var(--hud-text-dim)]">
              {l}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
