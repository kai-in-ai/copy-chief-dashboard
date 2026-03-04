'use client';

import { useState, useMemo } from 'react';
import useSWR from 'swr';
import { apiFetch } from '@/lib/utils';
import { SquadGrid } from '@/components/squad/SquadGrid';
import { ExpertDetail } from '@/components/squad/ExpertDetail';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { Search } from 'lucide-react';

interface Expert {
  id: string;
  name: string;
  tier: string;
  specialties: string[];
  style: string;
  avg_quality: number;
  reviews_count: number;
}

const TIER_ORDER: Record<string, number> = { '**': 0, '*': 1, '': 2, 'unknown': 3 };

export default function SquadPage() {
  const { data: experts = [], isLoading } = useSWR<Expert[]>('/squad', apiFetch, {
    refreshInterval: 120_000,
  });
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [selectedExpert, setSelectedExpert] = useState<string | null>(null);

  // Group by tier
  const tiers = useMemo(() => {
    const set = new Set(experts.map((e) => e.tier));
    return ['all', ...Array.from(set).sort((a, b) => (TIER_ORDER[a] ?? 9) - (TIER_ORDER[b] ?? 9))];
  }, [experts]);

  const filtered = useMemo(() => {
    return experts
      .filter((e) => {
        if (search && !e.name.toLowerCase().includes(search.toLowerCase()) &&
            !e.specialties.some((s) => s.toLowerCase().includes(search.toLowerCase()))) return false;
        if (tierFilter !== 'all' && e.tier !== tierFilter) return false;
        return true;
      })
      .sort((a, b) => (TIER_ORDER[a.tier] ?? 9) - (TIER_ORDER[b.tier] ?? 9));
  }, [experts, search, tierFilter]);

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-mono text-[var(--hud-text)]">Copy Squad</h1>

      <div className="flex gap-2">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-[var(--hud-text-dim)]" />
          <input
            type="text"
            placeholder="Search expert or specialty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs font-mono bg-[var(--hud-surface)] border border-[var(--hud-border)] text-[var(--hud-text)] rounded px-2 py-1.5 pl-7"
          />
        </div>
        <select
          value={tierFilter}
          onChange={(e) => setTierFilter(e.target.value)}
          className="text-xs font-mono bg-[var(--hud-surface)] border border-[var(--hud-border)] text-[var(--hud-text)] rounded px-2 py-1"
        >
          {tiers.map((t) => (
            <option key={t} value={t}>{t === 'all' ? 'All Tiers' : `Tier ${t}`}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <p className="text-xs font-mono text-[var(--hud-text-dim)] animate-pulse">Loading experts...</p>
      ) : (
        <ErrorBoundary section="Squad Grid">
          <SquadGrid
            experts={filtered}
            onExpertClick={(id) => setSelectedExpert(selectedExpert === id ? null : id)}
            selectedExpert={selectedExpert}
          />
        </ErrorBoundary>
      )}

      {/* Expert Detail Inline */}
      {selectedExpert && (
        <ErrorBoundary section="Expert Detail">
          <ExpertDetail
            expertId={selectedExpert}
            onClose={() => setSelectedExpert(null)}
          />
        </ErrorBoundary>
      )}

      <p className="text-[10px] font-mono text-[var(--hud-text-dim)]">
        {experts.length} experts loaded — Click card to expand details
      </p>
    </div>
  );
}
