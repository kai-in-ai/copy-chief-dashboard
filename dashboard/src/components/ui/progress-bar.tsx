import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  threshold?: number;
  className?: string;
  showLabel?: boolean;
}

export function ProgressBar({
  value,
  max = 100,
  threshold,
  className,
  showLabel = true,
}: ProgressBarProps) {
  const pct = Math.min((value / max) * 100, 100);
  const aboveThreshold = threshold !== undefined && value >= threshold;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="relative flex-1 h-2 bg-[var(--hud-surface)] rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            aboveThreshold ? 'bg-emerald-500' : pct > 60 ? 'bg-amber-500' : 'bg-red-500'
          )}
          style={{ width: `${pct}%` }}
        />
        {threshold !== undefined && (
          <div
            className="absolute top-0 bottom-0 w-px bg-emerald-400/50"
            style={{ left: `${(threshold / max) * 100}%` }}
          />
        )}
      </div>
      {showLabel && (
        <span className="text-[10px] font-mono text-[var(--hud-text-dim)] min-w-[3ch] text-right">
          {Math.round(pct)}%
        </span>
      )}
    </div>
  );
}
