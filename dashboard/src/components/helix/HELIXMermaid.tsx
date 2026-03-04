'use client';

import { useMemo } from 'react';
import { Mermaid } from '@/components/mermaidcn/mermaid';
import type { HelixPhase } from '@/stores/helix-store';

interface HELIXMermaidProps {
  phases: HelixPhase[];
}

const STATUS_STYLE: Record<string, { fill: string; stroke: string }> = {
  passed: { fill: '#065f46', stroke: '#10b981' },
  active: { fill: '#78350f', stroke: '#f59e0b' },
  pending: { fill: '#27272a', stroke: '#52525b' },
  failed: { fill: '#7f1d1d', stroke: '#ef4444' },
};

function sanitizeId(name: string): string {
  return name.replace(/[^a-zA-Z0-9_]/g, '_');
}

export function HELIXMermaid({ phases }: HELIXMermaidProps) {
  const chart = useMemo(() => {
    if (phases.length === 0) return '';

    const lines: string[] = ['flowchart LR'];

    // Define nodes
    for (const phase of phases) {
      const id = sanitizeId(phase.name);
      const label = phase.name.replace(/_/g, ' ');
      const isGate = phase.name.includes('GATE');

      if (isGate) {
        lines.push(`  ${id}{"${label}"}`);
      } else {
        lines.push(`  ${id}["${label}"]`);
      }
    }

    // Define edges (sequential)
    lines.push('');
    for (let i = 0; i < phases.length - 1; i++) {
      const from = sanitizeId(phases[i].name);
      const to = sanitizeId(phases[i + 1].name);
      lines.push(`  ${from} --> ${to}`);
    }

    // Define styles per status
    lines.push('');
    const statusGroups: Record<string, string[]> = {};
    for (const phase of phases) {
      const status = phase.status || 'pending';
      if (!statusGroups[status]) statusGroups[status] = [];
      statusGroups[status].push(sanitizeId(phase.name));
    }

    for (const [status, ids] of Object.entries(statusGroups)) {
      const style = STATUS_STYLE[status] || STATUS_STYLE.pending;
      const className = `status_${status}`;
      lines.push(`  classDef ${className} fill:${style.fill},stroke:${style.stroke},color:#fff,stroke-width:2px`);
      lines.push(`  class ${ids.join(',')} ${className}`);
    }

    return lines.join('\n');
  }, [phases]);

  if (!chart) return null;

  return (
    <div className="border border-[var(--hud-border)] rounded p-4 bg-[var(--hud-surface)]">
      <h3 className="text-xs font-mono text-[var(--hud-text-dim)] mb-3 uppercase tracking-wider">
        Pipeline Diagram
      </h3>
      <Mermaid
        chart={chart}
        config={{ theme: 'dark', darkMode: true, fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}
        className="min-h-[120px]"
      />
      <div className="flex gap-4 mt-3 pt-2 border-t border-[var(--hud-border)]">
        {Object.entries(STATUS_STYLE).map(([status, style]) => (
          <div key={status} className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded" style={{ backgroundColor: style.fill, border: `1px solid ${style.stroke}` }} />
            <span className="text-[10px] font-mono text-[var(--hud-text-dim)] capitalize">{status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
