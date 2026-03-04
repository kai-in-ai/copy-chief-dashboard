'use client';

import useSWR from 'swr';
import { apiFetch, cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface ExpertProfile {
  id: string;
  name: string;
  tier: string;
  specialties: string[];
  style: string;
  avg_quality: number;
  reviews_count: number;
  voice_dna?: string;
  anti_patterns?: string[];
  checklists?: string[];
  signature_moves?: string[];
}

interface ExpertDetailProps {
  expertId: string;
  onClose: () => void;
}

export function ExpertDetail({ expertId, onClose }: ExpertDetailProps) {
  const { data: expert, isLoading } = useSWR<ExpertProfile>(
    `/squad/${expertId}`,
    apiFetch
  );

  if (isLoading) {
    return (
      <div className="border border-[var(--hud-border)] rounded p-4 bg-[var(--hud-bg)] animate-pulse">
        <p className="text-xs font-mono text-[var(--hud-text-dim)]">Loading expert profile...</p>
      </div>
    );
  }

  if (!expert) return null;

  return (
    <div className="border border-[var(--hud-accent)]/30 rounded p-4 bg-[var(--hud-bg)] space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-mono text-[var(--hud-text)] font-bold">{expert.name}</h3>
        <button
          onClick={onClose}
          className="text-[10px] font-mono text-[var(--hud-text-dim)] hover:text-[var(--hud-text)]"
        >
          [close]
        </button>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant={expert.tier === '**' ? 'passed' : expert.tier === '*' ? 'active' : 'info'}>
          Tier {expert.tier}
        </Badge>
        {expert.style && (
          <span className="text-[10px] font-mono text-[var(--hud-text-dim)]">{expert.style}</span>
        )}
      </div>

      {/* All Specialties */}
      <div>
        <p className="text-[10px] font-mono text-[var(--hud-text-dim)] uppercase tracking-wider mb-1">Specialties</p>
        <div className="flex flex-wrap gap-1">
          {expert.specialties.map((s) => (
            <Badge key={s} variant="default">{s}</Badge>
          ))}
        </div>
      </div>

      {/* Signature Moves */}
      {expert.signature_moves && expert.signature_moves.length > 0 && (
        <div>
          <p className="text-[10px] font-mono text-[var(--hud-text-dim)] uppercase tracking-wider mb-1">Signature Moves</p>
          <ul className="space-y-0.5">
            {expert.signature_moves.map((m, i) => (
              <li key={i} className="text-[10px] font-mono text-emerald-400">+ {m}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Anti-Patterns */}
      {expert.anti_patterns && expert.anti_patterns.length > 0 && (
        <div>
          <p className="text-[10px] font-mono text-[var(--hud-text-dim)] uppercase tracking-wider mb-1">Anti-Patterns</p>
          <ul className="space-y-0.5">
            {expert.anti_patterns.slice(0, 8).map((a, i) => (
              <li key={i} className="text-[10px] font-mono text-red-400">- {a}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Checklists */}
      {expert.checklists && expert.checklists.length > 0 && (
        <div>
          <p className="text-[10px] font-mono text-[var(--hud-text-dim)] uppercase tracking-wider mb-1">Checklists</p>
          <div className="flex flex-wrap gap-1">
            {expert.checklists.map((c) => (
              <Badge key={c} variant="info">{c}</Badge>
            ))}
          </div>
        </div>
      )}

      {/* Voice DNA excerpt */}
      {expert.voice_dna && (
        <div>
          <p className="text-[10px] font-mono text-[var(--hud-text-dim)] uppercase tracking-wider mb-1">Voice DNA</p>
          <pre className="text-[10px] font-mono text-[var(--hud-text)] whitespace-pre-wrap bg-black/30 rounded p-2 max-h-40 overflow-auto">
            {expert.voice_dna}
          </pre>
        </div>
      )}
    </div>
  );
}
