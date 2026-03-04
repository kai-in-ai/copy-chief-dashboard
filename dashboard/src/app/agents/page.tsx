'use client';

import { useState, useEffect } from 'react';
import { useAgents } from '@/hooks/use-agents';
import { AgentGrid } from '@/components/agents/AgentGrid';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { Badge } from '@/components/ui/badge';
import { cn, formatRelativeTime, apiFetch } from '@/lib/utils';

interface AgentMemoryEntry {
  offer?: string;
  tool?: string;
  score?: number;
  result?: string;
  learning?: string;
  timestamp?: string;
  agent?: string;
}

interface AgentMemoryResponse {
  episodic: AgentMemoryEntry[];
  execution_log: AgentMemoryEntry[];
}

export default function AgentsPage() {
  const { agents, isLoading, isSSE } = useAgents();
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [detailTab, setDetailTab] = useState<'info' | 'history'>('info');
  const [agentMemory, setAgentMemory] = useState<AgentMemoryResponse | null>(null);
  const [memoryLoading, setMemoryLoading] = useState(false);

  const working = agents.filter(a => a.status === 'working');
  const selected = selectedAgent ? agents.find(a => a.name === selectedAgent) : null;

  // Fetch agent memory when selecting an agent and switching to history tab
  useEffect(() => {
    if (!selected || detailTab !== 'history') return;
    setMemoryLoading(true);
    apiFetch<AgentMemoryResponse>(`/agent-memory/${selected.name.toLowerCase()}`)
      .then(setAgentMemory)
      .catch(() => setAgentMemory(null))
      .finally(() => setMemoryLoading(false));
  }, [selected, detailTab]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-mono text-[var(--hud-text)]">Agents</h1>
        <div className="flex items-center gap-2">
          <Badge variant={isSSE ? 'success' : 'warning'}>
            {isSSE ? 'LIVE' : 'POLLING'}
          </Badge>
          <Badge variant={working.length > 0 ? 'success' : 'default'}>
            {working.length} active
          </Badge>
        </div>
      </div>

      {isLoading ? (
        <p className="text-xs font-mono text-[var(--hud-text-dim)] animate-pulse">Loading agents...</p>
      ) : (
        <ErrorBoundary section="Agent Grid">
          <AgentGrid
            agents={agents}
            selectedAgent={selectedAgent}
            onAgentClick={(name) => {
              setSelectedAgent(selectedAgent === name ? null : name);
              setDetailTab('info');
            }}
          />
        </ErrorBoundary>
      )}

      {/* Selected Agent Detail */}
      {selected && (
        <div className="border border-[var(--hud-border)] rounded p-4 bg-[var(--hud-surface)]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-black"
                style={{ backgroundColor: selected.color }}
              >
                {selected.initial}
              </div>
              <div>
                <p className="text-sm font-mono text-[var(--hud-text)]">{selected.name} <span className="text-[var(--hud-text-dim)]">{selected.handle}</span></p>
                <p className="text-xs font-mono text-[var(--hud-text-dim)]">{selected.role}</p>
              </div>
            </div>
            {/* Tabs */}
            <div className="flex gap-1">
              {(['info', 'history'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setDetailTab(tab)}
                  className={cn(
                    'px-3 py-1 rounded text-[10px] font-mono uppercase tracking-wider transition-colors',
                    detailTab === tab
                      ? 'bg-[var(--hud-accent)]/10 text-[var(--hud-accent)] border border-[var(--hud-accent)]/30'
                      : 'text-[var(--hud-text-dim)] hover:text-[var(--hud-text)] border border-transparent'
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {detailTab === 'info' && (
            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <span className="text-[var(--hud-text-dim)]">Status:</span>{' '}
                <span className={selected.status === 'working' ? 'text-emerald-400' : 'text-[var(--hud-text)]'}>{selected.status}</span>
              </div>
              <div>
                <span className="text-[var(--hud-text-dim)]">Offer:</span>{' '}
                <span className="text-[var(--hud-text)]">{selected.assigned_offer || '—'}</span>
              </div>
              <div className="col-span-2">
                <span className="text-[var(--hud-text-dim)]">Current Task:</span>{' '}
                <span className="text-[var(--hud-text)]">{selected.current_task || '—'}</span>
              </div>
            </div>
          )}

          {detailTab === 'history' && (
            <div className="space-y-2">
              {memoryLoading ? (
                <p className="text-xs font-mono text-[var(--hud-text-dim)] animate-pulse">Loading history...</p>
              ) : !agentMemory || (agentMemory.execution_log.length === 0 && agentMemory.episodic.length === 0) ? (
                <p className="text-xs font-mono text-[var(--hud-text-dim)]">No history found for {selected.name}</p>
              ) : (
                <>
                  {agentMemory.execution_log.slice(0, 10).map((entry, i) => (
                    <div key={`log-${i}`} className="flex items-center gap-2 text-[10px] font-mono py-1 border-b border-[var(--hud-border)]">
                      <span className="text-[var(--hud-text-dim)] shrink-0 w-20">
                        {entry.timestamp ? new Date(entry.timestamp).toLocaleDateString('pt-BR') : '—'}
                      </span>
                      <span className="text-[var(--hud-text-dim)] shrink-0 w-24 truncate">
                        {entry.offer || '—'}
                      </span>
                      <span className="text-[var(--hud-text)] truncate flex-1">
                        {entry.tool || entry.learning || '—'}
                      </span>
                      {entry.score !== undefined && entry.score > 0 && (
                        <span className={cn(
                          'shrink-0',
                          entry.score >= 8 ? 'text-emerald-400' : entry.score >= 7 ? 'text-amber-400' : 'text-red-400'
                        )}>
                          {entry.score}/10
                        </span>
                      )}
                      {entry.result && (
                        <span className={cn(
                          'shrink-0',
                          entry.result === 'passed' ? 'text-emerald-400' : 'text-amber-400'
                        )}>
                          {entry.result}
                        </span>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      )}

      <p className="text-[10px] font-mono text-[var(--hud-text-dim)]">
        {agents.length} personas — Real-time status via {isSSE ? 'SSE' : 'HTTP polling'}
      </p>
    </div>
  );
}
