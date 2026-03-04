'use client';

import { useEffect, useRef } from 'react';
import { cn, formatRelativeTime } from '@/lib/utils';
import type { MonitorEvent } from '@/stores/monitor-store';

// Agent colors matching AGENT_REGISTRY in semantic-translator.ts
const AGENT_COLORS: Record<string, { color: string; initial: string }> = {
  helix: { color: '#FFD700', initial: 'H' }, vox: { color: '#10B981', initial: 'V' },
  atlas: { color: '#3B82F6', initial: 'A' }, blade: { color: '#EF4444', initial: 'B' },
  hawk: { color: '#F59E0B', initial: 'K' }, scout: { color: '#06B6D4', initial: 'S' },
  forge: { color: '#8B5CF6', initial: 'F' }, echo: { color: '#EC4899', initial: 'E' },
  cipher: { color: '#14B8A6', initial: 'C' }, sentinel: { color: '#E8ECF4', initial: 'T' },
  ops: { color: '#78716C', initial: 'O' }, strategist: { color: '#D97706', initial: 'R' },
};

interface WarRoomActivityFeedProps {
  events: MonitorEvent[];
  agentFilter: string | null;
  offerFilter: string | null;
}

// Tool → Agent domain map (mirrors server-side TOOL_AGENT_MAP)
const TOOL_AGENT: Record<string, string> = {
  mcp__copywriting__blind_critic: 'hawk',
  mcp__copywriting__emotional_stress_test: 'hawk',
  mcp__copywriting__black_validation: 'hawk',
  mcp__copywriting__layered_review: 'hawk',
  mcp__copywriting__validate_gate: 'sentinel',
  mcp__copywriting__voc_search: 'vox',
  mcp__firecrawl__firecrawl_scrape: 'vox',
  mcp__firecrawl__firecrawl_search: 'vox',
  mcp__fb_ad_library__get_meta_ads: 'cipher',
  mcp__copywriting__create_mecanismo: 'atlas',
  mcp__copywriting__validate_mecanismo: 'atlas',
};

function detectAgent(event: MonitorEvent): string | null {
  // Priority 1: Semantic data from server (most accurate)
  if (event.semantic_data?.agent_name) {
    return event.semantic_data.agent_name.toLowerCase();
  }

  // Priority 2: Explicit agent_id from enriched payload
  const explicitAgent = event.data?.agent_id as string | undefined;
  if (explicitAgent && typeof explicitAgent === 'string') return explicitAgent.toLowerCase();

  // Priority 3: Tool → Agent domain mapping (deterministic, no substring heuristic)
  if (event.tool_name && TOOL_AGENT[event.tool_name]) {
    return TOOL_AGENT[event.tool_name];
  }

  // Priority 4: Only match explicit @handle patterns (no bare name matching)
  const text = (event.tool_name || '') + ' ' + JSON.stringify(event.data || '').slice(0, 300);
  const handleMatch = text.match(/@(chief|researcher|briefer|vsl|lp|creative|producer|critic|miner|ops|strategist|gatekeeper)/);
  if (handleMatch) {
    const HANDLE_MAP: Record<string, string> = {
      chief: 'helix', researcher: 'vox', briefer: 'atlas', vsl: 'echo',
      lp: 'forge', creative: 'scout', producer: 'blade', critic: 'hawk',
      miner: 'cipher', ops: 'ops', strategist: 'strategist', gatekeeper: 'sentinel',
    };
    return HANDLE_MAP[handleMatch[1]] || null;
  }

  return null;
}

function getActionText(event: MonitorEvent): string {
  // Priority 1: Semantic description from server
  if (event.semantic_description) return event.semantic_description;

  // Fallback: raw tool name
  return event.tool_name?.split('__').pop() || event.type;
}

export function WarRoomActivityFeed({ events, agentFilter, offerFilter }: WarRoomActivityFeedProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to top on new events
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [events.length]);

  const filtered = events.filter((event) => {
    if (agentFilter) {
      const agent = detectAgent(event);
      if (agent !== agentFilter.toLowerCase()) return false;
    }
    if (offerFilter) {
      // Check both raw offer path and semantic offer_short
      const offerMatch = event.offer === offerFilter ||
        event.semantic_data?.offer_short?.toLowerCase() === offerFilter.toLowerCase();
      if (!offerMatch) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    const hasUnfiltered = events.length > 0;
    const activeFilter = agentFilter || offerFilter;
    return (
      <div className="flex flex-col items-center justify-center py-8 text-[var(--hud-text-dim)] gap-2">
        <p className="text-xs font-mono">
          {hasUnfiltered && activeFilter
            ? `No activity for @${agentFilter || offerFilter} — ${events.length} events hidden by filter`
            : 'Waiting for activity...'}
        </p>
        {hasUnfiltered && activeFilter && (
          <p className="text-[10px] font-mono opacity-50">Click the active agent again to clear filter</p>
        )}
      </div>
    );
  }

  return (
    <div ref={scrollRef} className="space-y-0.5 overflow-y-auto max-h-72">
      {filtered.slice(0, 50).map((event) => {
        const agent = detectAgent(event);
        const isSemantic = !!event.semantic_data;
        const agentInfo = isSemantic
          ? { color: event.semantic_data!.agent_color, initial: event.semantic_data!.agent_initial }
          : agent ? AGENT_COLORS[agent] : null;
        const actionText = getActionText(event);
        const isMilestone = event.significance === 'milestone';

        return (
          <div
            key={event.id}
            className={cn(
              'flex items-center gap-2 px-2 py-1 rounded text-[10px] font-mono transition-colors',
              'hover:bg-[var(--hud-surface)]',
              event.is_error && 'bg-red-500/5',
              isMilestone && 'border-l-2'
            )}
            style={isMilestone ? { borderLeftColor: agentInfo?.color || 'var(--hud-accent)' } : undefined}
          >
            {/* Timestamp */}
            <span className="text-[var(--hud-text-dim)] shrink-0 w-12">
              {new Date(event.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </span>

            {/* Agent badge */}
            {agentInfo ? (
              <span
                className="w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-bold text-black shrink-0"
                style={{ backgroundColor: agentInfo.color }}
              >
                {agentInfo.initial}
              </span>
            ) : (
              <span className="w-4 h-4 rounded-full bg-[var(--hud-border)] shrink-0" />
            )}

            {/* Milestone badge */}
            {isMilestone && (
              <span className="px-1 py-0.5 rounded text-[8px] font-bold bg-[var(--hud-accent)]/15 text-[var(--hud-accent)] shrink-0">
                milestone
              </span>
            )}

            {/* Action text (semantic or raw) */}
            <span className={cn(
              'truncate flex-1',
              event.is_error ? 'text-red-400' : isSemantic ? 'text-[var(--hud-text)]' : 'text-[var(--hud-text-dim)]'
            )}>
              {actionText}
            </span>

            {/* Offer */}
            {(event.semantic_data?.offer_short || event.offer) && (
              <span className="text-[var(--hud-text-dim)] shrink-0">
                {event.semantic_data?.offer_short || event.offer?.split('/').pop()}
              </span>
            )}

            {/* Relative time */}
            <span className="text-[var(--hud-text-dim)] shrink-0">
              {formatRelativeTime(event.timestamp)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
