'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Bot, FileText, Settings } from 'lucide-react';
import type { ContextData } from '@/hooks/use-context';

interface ContextPanelProps {
  data: ContextData;
}

function CollapsibleSection({ title, icon: Icon, count, children }: { title: string; icon: typeof Bot; count?: number; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[var(--hud-border)] rounded bg-[var(--hud-surface)]">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full px-3 py-2 text-xs font-mono text-[var(--hud-text)] hover:bg-[var(--hud-border)]/20"
      >
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        <Icon size={14} className="text-[var(--hud-accent)]" />
        {title} {count !== undefined && <span className="text-[var(--hud-text-dim)]">({count})</span>}
      </button>
      {open && <div className="px-3 pb-3">{children}</div>}
    </div>
  );
}

export function ContextPanel({ data }: ContextPanelProps) {
  return (
    <div className="space-y-3">
      {/* Agent Definitions */}
      <CollapsibleSection title="Agent Definitions" icon={Bot} count={data.agents.length}>
        <div className="space-y-1">
          {data.agents.map(a => (
            <div key={a.name} className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-[var(--hud-text)]">{a.name} <span className="text-[var(--hud-accent)]">{a.handle}</span> {a.role && <span className="text-[var(--hud-text-dim)] ml-1">— {a.role}</span>}</span>
              <span className="text-[var(--hud-text-dim)]">{a.path}</span>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      {/* Core Config */}
      {data.config && (
        <CollapsibleSection title="Core Config" icon={Settings}>
          <pre className="text-[10px] font-mono text-[var(--hud-text)] overflow-auto max-h-48">
            {JSON.stringify(data.config, null, 2)}
          </pre>
        </CollapsibleSection>
      )}

      {/* Active Offer Context */}
      {data.active_offer && (
        <CollapsibleSection title="Active Offer" icon={FileText}>
          {data.active_offer.context && (
            <div className="mb-2">
              <p className="text-[10px] font-mono text-[var(--hud-text-dim)] mb-1">CONTEXT.md (excerpt)</p>
              <pre className="text-[10px] font-mono text-[var(--hud-text)] overflow-auto max-h-32 whitespace-pre-wrap">
                {data.active_offer.context}
              </pre>
            </div>
          )}
          {data.active_offer.mecanismo && (
            <div>
              <p className="text-[10px] font-mono text-[var(--hud-text-dim)] mb-1">Mecanismo Unico</p>
              <pre className="text-[10px] font-mono text-[var(--hud-text)] overflow-auto max-h-32">
                {JSON.stringify(data.active_offer.mecanismo, null, 2)}
              </pre>
            </div>
          )}
        </CollapsibleSection>
      )}
    </div>
  );
}
