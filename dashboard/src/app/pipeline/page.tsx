'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { apiFetch, formatRelativeTime, cn } from '@/lib/utils';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
import { useOfferStore } from '@/stores/offer-store';
import { useOffers } from '@/hooks/use-offers';
import { Badge } from '@/components/ui/badge';
import { ProgressBar } from '@/components/ui/progress-bar';
import { ScoreBadge } from '@/components/ui/score-badge';
import { PipelineStagePills } from '@/components/pipeline/PipelineStagePills';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { getNichoColor } from '@/lib/nicho-colors';

interface PipelineState {
  offer: string;
  pipeline: {
    status: string;
    mode: string;
    started_at: string;
    current_step: number;
    total_steps: number;
    current_deliverable: string;
    iteration: number;
    max_iterations: number;
    last_score: number;
    paused_at?: string;
    crashed_at?: string;
    completed_at?: string;
    // Bob orchestrator format fields
    current_phase?: string;
    steps_completed?: Array<{ id: string; phase: string; description: string; result: string }>;
    steps_remaining?: string[];
    overnight_mode?: boolean;
  } | null;
  handoffs: Array<{
    deliverable: string;
    status: string;
    completed_tasks: number;
    total_tasks: number;
    current_task?: string;
  }>;
  loops: Array<{
    file: string;
    deliverable: string;
    offer_path: string;
    iteration: number;
    max_iterations: number;
    last_score: number;
    status: string;
    feedback_categories: string[];
  }>;
}

interface PipelineSummary {
  offer: string;
  status: string;
  mode?: string;
  current_deliverable?: string;
  started_at?: string;
}

const STATUS_COLORS: Record<string, string> = {
  'IN_PROGRESS': 'text-[var(--hud-accent)]',
  'COMPLETED': 'text-emerald-400',
  'CRASHED': 'text-red-400',
  'PAUSED': 'text-yellow-400',
  'ABORTED': 'text-red-300',
  'STALE': 'text-orange-400',
  'IDLE': 'text-zinc-500',
  'HUMAN_GATE': 'text-amber-400',
};

const STATUS_BADGE: Record<string, 'active' | 'passed' | 'failed' | 'info'> = {
  'IN_PROGRESS': 'active',
  'COMPLETED': 'passed',
  'CRASHED': 'failed',
  'PAUSED': 'info',
  'ABORTED': 'failed',
  'STALE': 'info',
  'HUMAN_GATE': 'info',
};

export default function PipelinePage() {
  const { offers } = useOffers();
  const { selectedOffer, selectOffer } = useOfferStore();

  const { data: pipelines = [] } = useSWR<PipelineSummary[]>(
    '/pipelines',
    apiFetch,
    { refreshInterval: 10_000 }
  );

  const { data: detail, mutate: refreshDetail } = useSWR<PipelineState>(
    selectedOffer ? `/pipeline/${selectedOffer}` : null,
    apiFetch,
    { refreshInterval: 5_000 }
  );

  const sendCommand = async (command: 'pause' | 'resume' | 'abort') => {
    if (!selectedOffer) return;
    try {
      const res = await fetch(`${API_BASE}/pipeline/command`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offer: selectedOffer, command }),
      });
      if (!res.ok) {
        console.error(`Pipeline command failed: ${res.status}`);
      }
      refreshDetail();
    } catch (err) {
      console.error('Pipeline command error:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-mono text-[var(--hud-text)]">Pipeline Monitor</h1>
        <select
          value={selectedOffer || ''}
          onChange={(e) => selectOffer(e.target.value || null)}
          className="text-xs font-mono bg-[var(--hud-surface)] border border-[var(--hud-border)] text-[var(--hud-text)] rounded px-2 py-1"
        >
          <option value="">Select offer...</option>
          {offers.map((o) => (
            <option key={`${o.nicho}/${o.name}`} value={`${o.nicho}/${o.name}`}>{o.nicho}/{o.name}</option>
          ))}
        </select>
      </div>

      {/* Active Pipelines Summary */}
      <ErrorBoundary section="Pipelines">
      {pipelines.length > 0 && (
        <div>
          <h2 className="text-sm font-mono text-[var(--hud-text)] mb-2">Active Pipelines</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {pipelines.map((p) => (
              <button
                key={p.offer}
                onClick={() => selectOffer(p.offer)}
                className={cn(
                  'border rounded p-3 text-left transition-colors',
                  'border-[var(--hud-border)] bg-[var(--hud-surface)] hover:border-[var(--hud-accent)]'
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono text-[var(--hud-text)]">
                    {(() => {
                      const nicho = p.offer.split('/')[0];
                      const nc = getNichoColor(nicho);
                      return <span className={nc.text}>{p.offer}</span>;
                    })()}
                  </span>
                  <Badge variant={STATUS_BADGE[p.status] || 'info'}>{p.status}</Badge>
                </div>
                {p.current_deliverable && (
                  <p className="text-[10px] font-mono text-[var(--hud-text-dim)]">
                    {p.current_deliverable} ({p.mode || 'interactive'})
                  </p>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      </ErrorBoundary>

      {/* Offer Detail */}
      <ErrorBoundary section="Pipeline Detail">
      {!selectedOffer ? (
        <div className="flex flex-col items-center justify-center py-16 text-[var(--hud-text-dim)]">
          <p className="text-sm font-mono">Select an offer to monitor its pipeline</p>
          {pipelines.length === 0 && (
            <p className="text-xs opacity-50 mt-2">No active pipelines. Start one with /pipeline [offer]</p>
          )}
        </div>
      ) : !detail ? (
        <p className="text-xs font-mono text-[var(--hud-text-dim)] animate-pulse">Loading pipeline state...</p>
      ) : (
        <div className="space-y-4">
          {/* Pipeline State */}
          {detail.pipeline ? (
            <div className="border border-[var(--hud-border)] rounded p-4 bg-[var(--hud-surface)]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={cn('text-sm font-mono font-bold', STATUS_COLORS[detail.pipeline.status] || '')}>
                    {detail.pipeline.status}
                  </span>
                  <Badge variant="info">{detail.pipeline.mode}</Badge>
                </div>
                <div className="flex gap-1">
                  {detail.pipeline.status === 'IN_PROGRESS' && (
                    <button
                      onClick={() => sendCommand('pause')}
                      className="text-[10px] font-mono px-2 py-1 rounded border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
                    >
                      Pause
                    </button>
                  )}
                  {detail.pipeline.status === 'PAUSED' && (
                    <button
                      onClick={() => sendCommand('resume')}
                      className="text-[10px] font-mono px-2 py-1 rounded border border-[var(--hud-border)] text-[var(--hud-accent)] hover:bg-[var(--hud-accent-bg)]"
                    >
                      Resume
                    </button>
                  )}
                  {['IN_PROGRESS', 'PAUSED'].includes(detail.pipeline.status) && (
                    <button
                      onClick={() => sendCommand('abort')}
                      className="text-[10px] font-mono px-2 py-1 rounded border border-red-500/30 text-red-400 hover:bg-red-500/10"
                    >
                      Abort
                    </button>
                  )}
                </div>
              </div>

              <ProgressBar
                value={Math.round((detail.pipeline.current_step / detail.pipeline.total_steps) * 100)}
                className="mb-2"
              />

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[10px] font-mono">
                <div>
                  <p className="text-[var(--hud-text-dim)]">Step</p>
                  <p className="text-[var(--hud-text)]">{detail.pipeline.current_step}/{detail.pipeline.total_steps}</p>
                </div>
                <div>
                  <p className="text-[var(--hud-text-dim)]">Deliverable</p>
                  <p className="text-[var(--hud-text)]">{detail.pipeline.current_deliverable}</p>
                </div>
                <div>
                  <p className="text-[var(--hud-text-dim)]">Iteration</p>
                  <p className="text-[var(--hud-text)]">{detail.pipeline.iteration}/{detail.pipeline.max_iterations}</p>
                </div>
                <div>
                  <p className="text-[var(--hud-text-dim)]">Last Score</p>
                  <p className={cn((detail.pipeline.last_score || 0) >= 8 ? 'text-emerald-400' : 'text-yellow-400')}>
                    {(detail.pipeline.last_score || 0).toFixed(1)}
                  </p>
                </div>
              </div>

              {/* Pipeline Stage Pills (Bob Orchestrator) */}
              {(detail.pipeline.steps_completed?.length || detail.pipeline.steps_remaining?.length) ? (
                <div className="mt-3 border-t border-[var(--hud-border)] pt-3">
                  <PipelineStagePills
                    stepsCompleted={detail.pipeline.steps_completed || []}
                    stepsRemaining={detail.pipeline.steps_remaining || []}
                    currentPhase={detail.pipeline.current_phase}
                  />
                </div>
              ) : null}
            </div>
          ) : (
            <div className="border border-[var(--hud-border)] rounded p-4 bg-[var(--hud-surface)]">
              <p className="text-xs font-mono text-[var(--hud-text-dim)]">
                No pipeline state for this offer. Start with: /pipeline {selectedOffer}
              </p>
            </div>
          )}

          {/* Handoff Tasks */}
          {detail.handoffs.length > 0 && (
            <div>
              <h2 className="text-sm font-mono text-[var(--hud-text)] mb-2">Handoff Tasks</h2>
              <div className="space-y-2">
                {detail.handoffs.map((h) => (
                  <div
                    key={h.deliverable}
                    className="border border-[var(--hud-border)] rounded p-3 bg-[var(--hud-surface)]"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono text-[var(--hud-text)]">{h.deliverable}</span>
                      <Badge variant={h.status === 'completed' ? 'passed' : 'active'}>{h.status}</Badge>
                    </div>
                    <ProgressBar
                      value={h.total_tasks > 0 ? Math.round((h.completed_tasks / h.total_tasks) * 100) : 0}
                    />
                    <p className="text-[10px] font-mono text-[var(--hud-text-dim)] mt-1">
                      {h.completed_tasks}/{h.total_tasks} tasks
                      {h.current_task ? ` — Current: ${h.current_task}` : ''}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Production Loops */}
          {detail.loops.length > 0 && (
            <div>
              <h2 className="text-sm font-mono text-[var(--hud-text)] mb-2">Auto-Corrective Loops</h2>
              <div className="space-y-2">
                {detail.loops.map((l, i) => (
                  <div
                    key={i}
                    className="border border-[var(--hud-border)] rounded p-3 bg-[var(--hud-surface)]"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono text-[var(--hud-text)]">{l.deliverable}</span>
                      <div className="flex items-center gap-2">
                        <ScoreBadge score={l.last_score} />
                        <Badge variant={l.status === 'approved' ? 'passed' : l.status === 'escalated' ? 'failed' : 'active'}>
                          {l.status}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-[10px] font-mono text-[var(--hud-text-dim)]">
                      Iteration {l.iteration}/{l.max_iterations}
                      {l.feedback_categories?.length > 0 && ` — Issues: ${l.feedback_categories.join(', ')}`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      </ErrorBoundary>
    </div>
  );
}
