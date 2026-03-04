'use client';

import { Circle } from 'lucide-react';
import { useOfferStore } from '@/stores/offer-store';
import { useHelixStore } from '@/stores/helix-store';
import { useMonitorStore } from '@/stores/monitor-store';
import { CurrentToolIndicator } from '@/components/monitor/CurrentToolIndicator';
import { cn, formatRelativeTime } from '@/lib/utils';

export function StatusBar() {
  const selectedOffer = useOfferStore((s) => s.selectedOffer);
  const currentPhase = useHelixStore((s) => s.currentPhase);
  const connected = useMonitorStore((s) => s.connected);
  const events = useMonitorStore((s) => s.events);
  const lastEvent = events[0];

  return (
    <header className="flex items-center justify-between px-4 py-2 border-b border-[var(--hud-border)] bg-[var(--hud-bg)]">
      <div className="flex items-center gap-4">
        <span className="text-xs font-mono text-[var(--hud-text-dim)]">
          OFFER:{' '}
          <span className="text-[var(--hud-text)]">
            {selectedOffer || 'none'}
          </span>
        </span>
        <span className="text-xs font-mono text-[var(--hud-text-dim)]">
          PHASE:{' '}
          <span className="text-[var(--hud-accent)]">{currentPhase}</span>
        </span>
        <CurrentToolIndicator />
      </div>

      <div className="flex items-center gap-4">
        {lastEvent && (
          <span className="text-[10px] font-mono text-[var(--hud-text-dim)]">
            Last: {formatRelativeTime(lastEvent.timestamp)}
          </span>
        )}
        <div className="flex items-center gap-1.5">
          <Circle
            size={8}
            className={cn(
              'fill-current',
              connected ? 'text-emerald-400' : 'text-red-400'
            )}
          />
          <span className="text-[10px] font-mono text-[var(--hud-text-dim)]">
            {connected ? 'LIVE' : 'OFFLINE'}
          </span>
        </div>
      </div>
    </header>
  );
}
