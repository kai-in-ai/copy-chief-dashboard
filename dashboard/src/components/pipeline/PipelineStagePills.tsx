'use client';

import { cn } from '@/lib/utils';

interface StepCompleted {
  id: string;
  phase: string;
  description: string;
  result: string;
}

interface PipelineStagePillsProps {
  stepsCompleted: StepCompleted[];
  stepsRemaining: string[];
  currentPhase?: string;
}

const PILL_STYLES = {
  done: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400',
  active: 'bg-amber-500/20 border-amber-500/40 text-amber-400 animate-pulse',
  pending: 'bg-zinc-500/10 border-zinc-600/30 text-zinc-500',
  error: 'bg-red-500/20 border-red-500/40 text-red-400',
};

export function PipelineStagePills({ stepsCompleted, stepsRemaining, currentPhase }: PipelineStagePillsProps) {
  const allSteps = [
    ...stepsCompleted.map((s) => ({ id: s.id, label: s.id, status: 'done' as const, description: s.description })),
    ...stepsRemaining.map((s, i) => ({ id: s, label: s, status: (i === 0 ? 'active' : 'pending') as 'active' | 'pending', description: '' })),
  ];

  if (allSteps.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <p className="text-[10px] font-mono text-[var(--hud-text-dim)] uppercase tracking-wider">Pipeline Stages</p>
        {currentPhase && (
          <span className="text-[10px] font-mono text-amber-400">{currentPhase}</span>
        )}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {allSteps.map((step) => (
          <div
            key={step.id}
            className={cn(
              'px-2 py-0.5 rounded-full border text-[10px] font-mono transition-all',
              PILL_STYLES[step.status]
            )}
            title={step.description || step.id}
          >
            {step.status === 'done' && <span className="mr-1">&#10003;</span>}
            {step.status === 'active' && <span className="mr-1">&#9654;</span>}
            {step.label}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3 text-[10px] font-mono text-[var(--hud-text-dim)]">
        <span>{stepsCompleted.length} done</span>
        <span className="text-zinc-600">|</span>
        <span>{stepsRemaining.length} remaining</span>
        <span className="text-zinc-600">|</span>
        <span className="text-[var(--hud-text)]">
          {Math.round((stepsCompleted.length / (stepsCompleted.length + stepsRemaining.length)) * 100)}%
        </span>
      </div>
    </div>
  );
}
