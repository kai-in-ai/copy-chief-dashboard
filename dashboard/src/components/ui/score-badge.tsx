import { cn, formatScore, scoreColor } from '@/lib/utils';

interface ScoreBadgeProps {
  score: number;
  label?: string;
  className?: string;
}

export function ScoreBadge({ score, label, className }: ScoreBadgeProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {label && (
        <span className="text-[10px] font-mono text-[var(--hud-text-dim)]">{label}</span>
      )}
      <span className={cn('text-sm font-mono font-bold', scoreColor(score))}>
        {formatScore(score)}
      </span>
    </div>
  );
}
