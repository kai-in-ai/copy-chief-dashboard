import { cn } from '@/lib/utils';

const VARIANTS: Record<string, string> = {
  default: 'bg-[var(--hud-surface)] text-[var(--hud-text-dim)]',
  active: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  passed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  success: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  failed: 'bg-red-500/20 text-red-400 border-red-500/30',
  warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  pending: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
  info: 'bg-[var(--status-info-bg)] text-[var(--status-info)] border-[var(--status-info-border)]',
};

interface BadgeProps {
  variant?: keyof typeof VARIANTS;
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 text-[10px] font-mono rounded border',
        VARIANTS[variant] || VARIANTS.default,
        className
      )}
    >
      {children}
    </span>
  );
}
