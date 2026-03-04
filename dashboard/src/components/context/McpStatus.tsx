'use client';

import { cn } from '@/lib/utils';

interface McpStatusProps {
  mcps: { name: string; status: 'online' | 'offline' | 'unknown' }[];
}

const STATUS_COLORS: Record<string, string> = {
  online: 'bg-emerald-400',
  offline: 'bg-red-400',
  unknown: 'bg-yellow-400',
};

export function McpStatus({ mcps }: McpStatusProps) {
  return (
    <div className="border border-[var(--hud-border)] rounded bg-[var(--hud-surface)] p-3">
      <h3 className="text-xs font-mono text-[var(--hud-text)] mb-2">MCP Servers</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {mcps.map(m => (
          <div key={m.name} className="flex items-center gap-2 text-[11px] font-mono">
            <span className={cn('w-2 h-2 rounded-full', STATUS_COLORS[m.status])} />
            <span className="text-[var(--hud-text)]">{m.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
