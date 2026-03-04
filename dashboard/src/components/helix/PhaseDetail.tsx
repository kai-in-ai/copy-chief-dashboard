import { Badge } from '@/components/ui/badge';
import type { HelixPhase } from '@/stores/helix-store';

interface PhaseDetailProps {
  phase: HelixPhase;
}

export function PhaseDetail({ phase }: PhaseDetailProps) {
  const duration = phase.started_at && phase.completed_at
    ? formatDuration(phase.started_at, phase.completed_at)
    : null;

  return (
    <div className="border border-[var(--hud-border)] rounded p-4 bg-[var(--hud-surface)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-mono text-[var(--hud-text)] font-bold">
          {phase.name.replace(/_/g, ' ')}
        </h3>
        <Badge variant={phase.status as 'passed' | 'active' | 'pending' | 'failed'}>
          {phase.status.toUpperCase()}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-[10px] font-mono text-[var(--hud-text-dim)] mb-1 uppercase">Started</p>
          <p className="text-xs font-mono text-[var(--hud-text)]">
            {phase.started_at || '—'}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-mono text-[var(--hud-text-dim)] mb-1 uppercase">Completed</p>
          <p className="text-xs font-mono text-[var(--hud-text)]">
            {phase.completed_at || '—'}
          </p>
        </div>
        {duration && (
          <div className="col-span-2">
            <p className="text-[10px] font-mono text-[var(--hud-text-dim)] mb-1 uppercase">Duration</p>
            <p className="text-xs font-mono text-[var(--hud-accent)]">{duration}</p>
          </div>
        )}
      </div>

      {phase.tools_used.length > 0 && (
        <div className="mt-4">
          <p className="text-[10px] font-mono text-[var(--hud-text-dim)] mb-2 uppercase">
            Tools Used ({phase.tools_used.length})
          </p>
          <div className="flex flex-wrap gap-1">
            {phase.tools_used.map((t) => (
              <Badge key={t} variant="passed">{shortToolName(t)}</Badge>
            ))}
          </div>
        </div>
      )}

      {phase.tools_missing.length > 0 && (
        <div className="mt-3">
          <p className="text-[10px] font-mono text-[var(--hud-text-dim)] mb-2 uppercase">
            Tools Missing ({phase.tools_missing.length})
          </p>
          <div className="flex flex-wrap gap-1">
            {phase.tools_missing.map((t) => (
              <Badge key={t} variant="failed">{shortToolName(t)}</Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function shortToolName(name: string): string {
  // mcp__copywriting__blind_critic -> blind_critic
  const parts = name.split('__');
  return parts[parts.length - 1];
}

function formatDuration(start: string, end: string): string {
  try {
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    const diff = e - s;
    if (diff < 60_000) return `${Math.round(diff / 1000)}s`;
    if (diff < 3_600_000) return `${Math.round(diff / 60_000)}min`;
    if (diff < 86_400_000) return `${(diff / 3_600_000).toFixed(1)}h`;
    return `${Math.round(diff / 86_400_000)}d`;
  } catch {
    return '—';
  }
}
