import { cn } from '@/lib/utils';
import { OfferCard } from './OfferCard';
import type { OfferStatus } from '@/stores/offer-store';

const COLUMN_COLORS: Record<string, string> = {
  IDLE: 'border-zinc-600',
  RESEARCH: 'border-[var(--phase-research)]',
  BRIEFING: 'border-amber-500',
  PRODUCTION: 'border-violet-500',
  DELIVERED: 'border-emerald-500',
};

interface KanbanColumnProps {
  name: string;
  offers: OfferStatus[];
}

export function KanbanColumn({ name, offers }: KanbanColumnProps) {
  return (
    <div className="flex flex-col min-w-[220px] flex-1">
      <div
        className={cn(
          'flex items-center justify-between px-3 py-2 border-t-2 rounded-t bg-[var(--hud-surface)]',
          COLUMN_COLORS[name] || 'border-zinc-600'
        )}
      >
        <h2 className="text-xs font-mono font-bold text-[var(--hud-text)] uppercase tracking-wider">
          {name}
        </h2>
        <span className="text-[10px] font-mono text-[var(--hud-text-dim)]">
          {offers.length}
        </span>
      </div>
      <div className="flex-1 space-y-2 p-2 bg-[var(--hud-bg)] border border-t-0 border-[var(--hud-border)] rounded-b min-h-[200px]">
        {offers.map((offer) => (
          <OfferCard key={offer.name} offer={offer} />
        ))}
        {offers.length === 0 && (
          <p className="text-[10px] font-mono text-[var(--hud-text-dim)] text-center py-8 opacity-40">
            empty
          </p>
        )}
      </div>
    </div>
  );
}
