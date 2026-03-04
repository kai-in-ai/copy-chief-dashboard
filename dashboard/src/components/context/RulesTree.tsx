'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, FileText } from 'lucide-react';

interface RulesTreeProps {
  rules: { name: string; path: string }[];
}

export function RulesTree({ rules }: RulesTreeProps) {
  const [expanded, setExpanded] = useState(true);

  // Group by directory
  const grouped = rules.reduce<Record<string, { name: string; path: string }[]>>((acc, r) => {
    const parts = r.path.split('/');
    const dir = parts.slice(0, -1).join('/');
    if (!acc[dir]) acc[dir] = [];
    acc[dir].push(r);
    return acc;
  }, {});

  return (
    <div className="border border-[var(--hud-border)] rounded bg-[var(--hud-surface)]">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 w-full px-3 py-2 text-xs font-mono text-[var(--hud-text)] hover:bg-[var(--hud-border)]/20"
      >
        {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        Active Rules ({rules.length})
      </button>
      {expanded && (
        <div className="px-3 pb-2 space-y-2">
          {Object.entries(grouped).map(([dir, items]) => (
            <div key={dir}>
              <p className="text-[10px] font-mono text-[var(--hud-text-dim)] mb-1">{dir}</p>
              {items.map(r => (
                <div key={r.path} className="flex items-center gap-1.5 ml-3 text-[11px] font-mono text-[var(--hud-text)]">
                  <FileText size={12} className="text-[var(--hud-text-dim)]" />
                  {r.name}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
