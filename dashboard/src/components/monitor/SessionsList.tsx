'use client';

import { useState, useMemo } from 'react';
import useSWR from 'swr';
import { apiFetch, formatRelativeTime, cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { getNichoColor } from '@/lib/nicho-colors';
import { useMonitorStore, type MonitorEvent } from '@/stores/monitor-store';

interface EnrichedSession {
  id: string;
  status: string;
  event_count: number;
  tool_calls: number;
  errors: number;
  start_time: number;
  last_activity: number;
  offer?: string;
  phase?: string;
  cwd?: string;
  last_tool?: string;
  last_tool_input?: string;
  // Enriched by server
  duration_sec: number;
  idle_sec: number;
  tool_summary: string;
  short_cwd: string;
}

const STATUS_VARIANT: Record<string, 'active' | 'passed' | 'failed' | 'info' | 'pending'> = {
  active: 'active',
  idle: 'pending',
  completed: 'passed',
};

const TOOL_ABBR: Record<string, string> = {
  Read: 'RD',
  Write: 'WR',
  Edit: 'ED',
  Bash: 'SH',
  Grep: 'GR',
  Glob: 'GL',
  Task: 'TK',
  WebFetch: 'WF',
  WebSearch: 'WS',
  Skill: 'SK',
  AskUserQuestion: 'AQ',
};

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h${m > 0 ? `${m}m` : ''}`;
}

function getToolDisplayName(toolName: string): string {
  if (toolName.startsWith('mcp__')) {
    const parts = toolName.split('__');
    return parts.length >= 3 ? parts[2] : parts.pop() || toolName;
  }
  return toolName;
}

export function SessionsList() {
  const [expanded, setExpanded] = useState(true);
  const { data: sessions = [] } = useSWR<EnrichedSession[]>(
    '/sessions',
    apiFetch,
    { refreshInterval: 5_000 }
  );

  const events = useMonitorStore((s) => s.events);

  // Compute running tools per session from WS events
  const currentTools = useMemo(() => {
    const map = new Map<string, MonitorEvent>();
    const bySession = new Map<string, MonitorEvent[]>();
    for (const e of events) {
      if (!e.session_id) continue;
      if (!bySession.has(e.session_id)) bySession.set(e.session_id, []);
      bySession.get(e.session_id)!.push(e);
    }
    for (const [sid, evts] of bySession) {
      const pre = evts.filter((e) => e.type === 'PreToolUse');
      const post = evts.filter((e) => e.type === 'PostToolUse');
      for (const p of pre) {
        const hasPost = post.some(
          (po) => po.tool_name === p.tool_name && po.timestamp > p.timestamp
        );
        if (!hasPost) { map.set(sid, p); break; }
      }
    }
    return map;
  }, [events]);

  // Sort: active first, then idle, then completed
  const sortedSessions = [...sessions].sort((a, b) => {
    const order: Record<string, number> = { active: 0, idle: 1, completed: 2 };
    const diff = (order[a.status] ?? 3) - (order[b.status] ?? 3);
    if (diff !== 0) return diff;
    return b.last_activity - a.last_activity;
  });

  const activeSessions = sessions.filter(s => s.status === 'active');

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between mb-2"
      >
        <h2 className="text-sm font-mono text-[var(--hud-text)]">
          Sessions
          {activeSessions.length > 0 && (
            <span className="ml-2 text-[10px] text-emerald-400">
              {activeSessions.length} active
            </span>
          )}
        </h2>
        <span className="text-[10px] font-mono text-[var(--hud-text-dim)]">
          {sessions.length} total {expanded ? '▼' : '▶'}
        </span>
      </button>

      {expanded && (
        <div className="space-y-2">
          {sortedSessions.length === 0 ? (
            <div className="border border-[var(--hud-border)] rounded p-4 bg-[var(--hud-surface)]">
              <p className="text-xs font-mono text-[var(--hud-text-dim)] text-center">
                No sessions recorded yet
              </p>
            </div>
          ) : (
            sortedSessions.slice(0, 15).map((s) => {
              const runningTool = currentTools.get(s.id);
              const nicho = s.offer?.split('/')[0];
              const nc = nicho ? getNichoColor(nicho) : null;
              const isActive = s.status === 'active';

              return (
                <div
                  key={s.id}
                  className={cn(
                    'border rounded p-3 bg-[var(--hud-surface)] transition-colors',
                    isActive
                      ? 'border-amber-500/40'
                      : 'border-[var(--hud-border)]',
                    runningTool && 'border-amber-500/60'
                  )}
                >
                  {/* Row 1: Session ID + Status + Offer */}
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      {/* Active pulse indicator */}
                      {isActive && (
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-[var(--hud-text-dim)]">
                        {s.id.slice(0, 20)}
                      </span>
                      <Badge variant={STATUS_VARIANT[s.status] || 'info'}>{s.status}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      {s.offer && (
                        <span className={cn('text-[10px] font-mono font-bold', nc?.text || 'text-[var(--hud-text)]')}>
                          {s.offer}
                        </span>
                      )}
                      {s.phase && (
                        <Badge variant="info">{s.phase}</Badge>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Current tool / last tool */}
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      {runningTool ? (
                        <>
                          <span className="text-[10px] font-mono text-amber-400 animate-pulse">
                            ▶ {getToolDisplayName(runningTool.tool_name || '')}
                          </span>
                          {runningTool.tool_input && (
                            <span className="text-[10px] font-mono text-[var(--hud-text-dim)] truncate max-w-[200px]">
                              {(() => {
                                const inp = runningTool.tool_input!;
                                if (inp.file_path) return String(inp.file_path).split('/').slice(-2).join('/');
                                if (inp.command) return String(inp.command).substring(0, 50);
                                if (inp.pattern) return String(inp.pattern);
                                if (inp.description) return String(inp.description);
                                return '';
                              })()}
                            </span>
                          )}
                        </>
                      ) : s.last_tool ? (
                        <>
                          <span className="text-[10px] font-mono text-[var(--hud-text-dim)]">
                            {TOOL_ABBR[s.last_tool] || getToolDisplayName(s.last_tool)}
                          </span>
                          {s.tool_summary && (
                            <span className="text-[10px] font-mono text-[var(--hud-text-dim)] opacity-60 truncate max-w-[200px]">
                              {s.tool_summary}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-[10px] font-mono text-[var(--hud-text-dim)] opacity-40">
                          no tool data
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Row 3: Stats bar */}
                  <div className="flex items-center gap-3 text-[10px] font-mono text-[var(--hud-text-dim)]">
                    <span title="Duration">{formatDuration(s.duration_sec)}</span>
                    <span title="Events">{s.event_count} ev</span>
                    <span title="Tool calls">{s.tool_calls} tools</span>
                    {s.errors > 0 && (
                      <span className="text-red-400" title="Errors">{s.errors} err</span>
                    )}
                    {s.idle_sec > 0 && s.status !== 'active' && (
                      <span className="opacity-50" title="Idle time">idle {formatDuration(s.idle_sec)}</span>
                    )}
                    {s.short_cwd && (
                      <span className="opacity-40 truncate max-w-[150px]" title={s.cwd}>
                        {s.short_cwd}
                      </span>
                    )}
                    <span className="ml-auto opacity-50">
                      {formatRelativeTime(s.last_activity)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
