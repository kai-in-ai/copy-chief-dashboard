'use client';

import { useMemo } from 'react';
import { CheckCircle2, Circle, Loader2, XCircle, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { HelixPhase } from '@/stores/helix-store';
import { getPercentComplete } from '@/stores/helix-store';

// --- Constants ---

const PHASE_NAMES = [
  'VOC',
  'FUNDAMENTOS',
  'AVATAR',
  'RESEARCH_GATE',
  'PROBLEMA_VILAO_MUP',
  'SOLUCAO_MUS',
  'BRIEFING_GATE',
  'PRODUCAO',
  'VALIDACAO',
  'ENTREGA',
] as const;

type PhaseName = (typeof PHASE_NAMES)[number];

/** Which block each phase belongs to, used for gate dividers. */
const PHASE_BLOCK: Record<PhaseName, 'research' | 'briefing' | 'production'> = {
  VOC: 'research',
  FUNDAMENTOS: 'research',
  AVATAR: 'research',
  RESEARCH_GATE: 'research',
  PROBLEMA_VILAO_MUP: 'briefing',
  SOLUCAO_MUS: 'briefing',
  BRIEFING_GATE: 'briefing',
  PRODUCAO: 'production',
  VALIDACAO: 'production',
  ENTREGA: 'production',
};

const BLOCK_LABEL: Record<string, string> = {
  research: 'RESEARCH',
  briefing: 'BRIEFING',
  production: 'PRODUCTION',
};

const STATUS_ICON: Record<string, typeof Circle> = {
  passed: CheckCircle2,
  active: Loader2,
  pending: Circle,
  failed: XCircle,
};

const STATUS_PILL_CLASSES: Record<string, string> = {
  passed: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400',
  active: 'border-amber-500/50 bg-amber-500/10 text-amber-400 animate-pulse',
  pending: 'border-zinc-600 bg-zinc-800/40 text-zinc-500',
  failed: 'border-red-500/50 bg-red-500/10 text-red-400',
};

const STATUS_ICON_COLOR: Record<string, string> = {
  passed: 'text-emerald-400',
  active: 'text-amber-400',
  pending: 'text-zinc-500',
  failed: 'text-red-400',
};

// --- Props ---

interface HELIXPipelinePanelProps {
  phases: HelixPhase[];
  selectedPhase: number | null;
  onPhaseSelect: (index: number | null) => void;
  className?: string;
}

// --- Component ---

export function HELIXPipelinePanel({
  phases,
  selectedPhase,
  onPhaseSelect,
  className,
}: HELIXPipelinePanelProps) {
  const pct = useMemo(() => getPercentComplete(phases), [phases]);
  const passedCount = useMemo(
    () => phases.filter((p) => p.status === 'passed').length,
    [phases],
  );

  /** Build groups of phases separated by block boundaries. */
  const blocks = useMemo(() => {
    if (phases.length === 0) return [];

    const groups: { label: string; phases: { phase: HelixPhase; globalIndex: number }[] }[] = [];
    let currentBlock: string | null = null;

    for (let i = 0; i < phases.length; i++) {
      const phase = phases[i];
      const block = PHASE_BLOCK[phase.name as PhaseName] ?? 'research';

      if (block !== currentBlock) {
        groups.push({ label: BLOCK_LABEL[block] ?? block.toUpperCase(), phases: [] });
        currentBlock = block;
      }

      groups[groups.length - 1].phases.push({ phase, globalIndex: i });
    }

    return groups;
  }, [phases]);

  if (phases.length === 0) {
    return (
      <div className={cn('border border-[var(--hud-border)] rounded p-4 bg-[var(--hud-surface)]', className)}>
        <p className="text-xs font-mono text-[var(--hud-text-dim)] text-center py-4">
          No pipeline data available
        </p>
      </div>
    );
  }

  return (
    <div className={cn('border border-[var(--hud-border)] rounded p-4 bg-[var(--hud-surface)]', className)}>
      {/* Header with progress */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-mono text-[var(--hud-text-dim)] uppercase tracking-wider">
          Pipeline
        </h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-20 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  pct === 100
                    ? 'bg-emerald-500'
                    : pct > 50
                      ? 'bg-amber-500'
                      : 'bg-zinc-500',
                )}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-[var(--hud-text-dim)]">
              {passedCount}/{phases.length}
            </span>
          </div>
          <Badge variant={pct === 100 ? 'passed' : pct > 0 ? 'active' : 'pending'}>
            {pct}%
          </Badge>
        </div>
      </div>

      {/* Pipeline pills with block dividers */}
      <div className="flex items-center gap-1 flex-wrap">
        {blocks.map((block, blockIdx) => (
          <div key={block.label} className="flex items-center gap-1">
            {/* Gate divider before block (except first) */}
            {blockIdx > 0 && (
              <div className="flex flex-col items-center mx-1">
                <ChevronRight size={14} className="text-[var(--hud-text-dim)]" />
              </div>
            )}

            {/* Block wrapper */}
            <div className="flex flex-col gap-1">
              {/* Block label */}
              <span className="text-[8px] font-mono text-[var(--hud-text-dim)] uppercase tracking-widest px-1">
                {block.label}
              </span>

              {/* Phase pills row */}
              <div className="flex items-center gap-1">
                {block.phases.map(({ phase, globalIndex }) => {
                  const Icon = STATUS_ICON[phase.status] || Circle;
                  const isGate = phase.name.includes('GATE');
                  const isSelected = globalIndex === selectedPhase;

                  return (
                    <button
                      key={phase.name}
                      onClick={() =>
                        onPhaseSelect(isSelected ? null : globalIndex)
                      }
                      title={`${phase.name.replace(/_/g, ' ')} — ${phase.status}`}
                      className={cn(
                        'flex items-center gap-1 px-2 py-1.5 rounded border text-[10px] font-mono transition-all whitespace-nowrap',
                        STATUS_PILL_CLASSES[phase.status] ?? STATUS_PILL_CLASSES.pending,
                        isGate && 'border-dashed',
                        isSelected &&
                          'ring-1 ring-[var(--hud-accent)] border-[var(--hud-accent)] bg-[var(--hud-accent)]/10',
                      )}
                    >
                      <Icon
                        size={12}
                        className={cn(
                          STATUS_ICON_COLOR[phase.status],
                          phase.status === 'active' && 'animate-spin',
                        )}
                      />
                      <span>{formatPillLabel(phase.name)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-3 pt-2 border-t border-[var(--hud-border)]">
        {(['passed', 'active', 'pending', 'failed'] as const).map((status) => {
          const Icon = STATUS_ICON[status];
          return (
            <div key={status} className="flex items-center gap-1">
              <Icon size={10} className={STATUS_ICON_COLOR[status]} />
              <span className="text-[9px] font-mono text-[var(--hud-text-dim)] capitalize">
                {status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- Helpers ---

/** Shorten phase names for pill labels. */
function formatPillLabel(name: string): string {
  const SHORT: Record<string, string> = {
    VOC: 'VOC',
    FUNDAMENTOS: 'FUND',
    AVATAR: 'AVATAR',
    RESEARCH_GATE: 'R-GATE',
    PROBLEMA_VILAO_MUP: 'MUP',
    SOLUCAO_MUS: 'MUS',
    BRIEFING_GATE: 'B-GATE',
    PRODUCAO: 'PROD',
    VALIDACAO: 'VALID',
    ENTREGA: 'ENTREGA',
  };
  return SHORT[name] ?? name.replace(/_/g, ' ');
}
