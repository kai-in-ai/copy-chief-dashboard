import { cn } from '@/lib/utils';

interface StatusIndicatorProps {
  status: 'online' | 'offline' | 'warning' | 'active';
  label?: string;
  className?: string;
}

const COLORS: Record<string, string> = {
  online: 'bg-emerald-400',
  offline: 'bg-red-400',
  warning: 'bg-amber-400',
  active: 'bg-amber-400 animate-pulse',
};

export function StatusIndicator({ status, label, className }: StatusIndicatorProps) {
  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <span className={cn('w-2 h-2 rounded-full', COLORS[status])} />
      {label && (
        <span className="text-[10px] font-mono text-[var(--hud-text-dim)]">{label}</span>
      )}
    </div>
  );
}
