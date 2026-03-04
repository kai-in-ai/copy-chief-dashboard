'use client';

import { useState, useMemo } from 'react';
import { useMonitorStore } from '@/stores/monitor-store';
import { ActivityFeed } from '@/components/monitor/ActivityFeed';
import { SessionsList } from '@/components/monitor/SessionsList';
import { SynapseWidget } from '@/components/monitor/SynapseWidget';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { Badge } from '@/components/ui/badge';

export default function MonitorPage() {
  const events = useMonitorStore((s) => s.events);
  const connected = useMonitorStore((s) => s.connected);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [offerFilter, setOfferFilter] = useState<string>('all');

  const types = useMemo(() => {
    const set = new Set(events.map((e) => e.type));
    return ['all', ...Array.from(set).sort()];
  }, [events]);

  const offers = useMemo(() => {
    const set = new Set(events.filter((e) => e.offer).map((e) => e.offer!));
    return ['all', ...Array.from(set).sort()];
  }, [events]);

  const filtered = useMemo(() => {
    return events.filter((e) => {
      if (typeFilter !== 'all' && e.type !== typeFilter) return false;
      if (offerFilter !== 'all' && e.offer !== offerFilter) return false;
      return true;
    });
  }, [events, typeFilter, offerFilter]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-mono text-[var(--hud-text)]">
          Monitor
        </h1>
        <div className="flex items-center gap-2">
          <Badge variant={connected ? 'passed' : 'failed'}>
            {connected ? 'CONNECTED' : 'DISCONNECTED'}
          </Badge>
          <span className="text-[10px] font-mono text-[var(--hud-text-dim)]">
            {events.length} events
          </span>
        </div>
      </div>

      {!connected && (
        <div className="p-3 rounded border border-red-500/30 bg-red-500/5">
          <p className="text-xs font-mono text-red-400">
            WebSocket disconnected. Ensure backend is running on port 4001.
          </p>
        </div>
      )}

      <div className="flex gap-2">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="text-xs font-mono bg-[var(--hud-surface)] border border-[var(--hud-border)] text-[var(--hud-text)] rounded px-2 py-1"
        >
          {types.map((t) => (
            <option key={t} value={t}>{t === 'all' ? 'All Types' : t}</option>
          ))}
        </select>

        <select
          value={offerFilter}
          onChange={(e) => setOfferFilter(e.target.value)}
          className="text-xs font-mono bg-[var(--hud-surface)] border border-[var(--hud-border)] text-[var(--hud-text)] rounded px-2 py-1"
        >
          {offers.map((o) => (
            <option key={o} value={o}>{o === 'all' ? 'All Offers' : o}</option>
          ))}
        </select>
      </div>

      {/* Sessions — Primary visibility */}
      <ErrorBoundary section="Sessions">
        <SessionsList />
      </ErrorBoundary>

      {/* SYNAPSE Context Engine */}
      <ErrorBoundary section="SYNAPSE">
        <SynapseWidget />
      </ErrorBoundary>

      <ErrorBoundary section="Activity Feed">
        <ActivityFeed events={filtered} />
      </ErrorBoundary>
    </div>
  );
}
