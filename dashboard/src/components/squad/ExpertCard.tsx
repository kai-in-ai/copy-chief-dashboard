import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ScoreBadge } from '@/components/ui/score-badge';

interface Expert {
  id: string;
  name: string;
  tier: string;
  specialties: string[];
  style: string;
  avg_quality: number;
  reviews_count: number;
}

interface ExpertCardProps {
  expert: Expert;
  onClick?: () => void;
  isSelected?: boolean;
}

export function ExpertCard({ expert, onClick, isSelected }: ExpertCardProps) {
  const initials = expert.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      onClick={onClick}
      className={cn(
        'border rounded p-3 bg-[var(--hud-surface)] transition-colors',
        onClick && 'cursor-pointer',
        isSelected
          ? 'border-[var(--hud-accent)] shadow-[0_0_8px_var(--hud-accent-dim)]'
          : 'border-[var(--hud-border)] hover:border-[var(--hud-text-dim)]'
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[var(--hud-accent)]/20 flex items-center justify-center text-xs font-mono text-[var(--hud-accent)] font-bold">
            {initials}
          </div>
          <div>
            <h3 className="text-xs font-mono text-[var(--hud-text)] font-bold">{expert.name}</h3>
            <p className="text-[10px] font-mono text-[var(--hud-text-dim)]">Tier {expert.tier}</p>
          </div>
        </div>
        {expert.avg_quality > 0 && (
          <div className="flex items-center gap-1">
            <span className="text-[9px] font-mono text-[var(--hud-text-dim)]">Sys Avg</span>
            <ScoreBadge score={expert.avg_quality} />
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-1 mb-2">
        {expert.specialties.slice(0, 5).map((s) => (
          <Badge key={s} variant="default">{s}</Badge>
        ))}
        {expert.specialties.length > 5 && (
          <Badge variant="default">+{expert.specialties.length - 5}</Badge>
        )}
      </div>

      <div className="flex items-center justify-between">
        {expert.style && (
          <p className="text-[10px] font-mono text-[var(--hud-text-dim)] truncate flex-1">
            {expert.style}
          </p>
        )}
        {expert.reviews_count > 0 && (
          <span className="text-[10px] font-mono text-[var(--hud-text-dim)] ml-2">
            {expert.reviews_count} reviews
          </span>
        )}
      </div>
    </div>
  );
}
