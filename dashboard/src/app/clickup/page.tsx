'use client';

import useSWR from 'swr';
import { apiFetch, formatRelativeTime, cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { SyncExecutor } from '@/components/clickup/SyncExecutor';
import { useSSE } from '@/hooks/useSSE';

interface ClickUpSync {
  offer: string;
  last_synced: string;
  task_count: number;
}

interface ClickUpDetail {
  offer: string;
  sync: {
    workspace_id: string;
    space_id: string;
    folder_id?: string;
    list_id?: string;
    parent_task_id?: string;
    phase_tasks: Record<string, string>;
    gate_tasks: Record<string, string>;
    deliverable_tasks: Record<string, string>;
    research_tasks: Record<string, string>;
    last_synced: string;
    sync_errors?: Array<{ timestamp: string; error: string; operation: string }>;
  };
}

const GATE_LABELS: Record<string, string> = {
  research: 'Research Gate',
  briefing: 'Briefing Gate',
  production: 'Production Gate',
};

const DELIVERABLE_LABELS: Record<string, string> = {
  vsl: 'VSL',
  landing_page: 'Landing Page',
  creatives: 'Criativos',
  emails: 'Emails',
};

const RESEARCH_LABELS: Record<string, string> = {
  voc: 'VOC Extraction',
  competitors: 'Competitors Analysis',
  mechanism: 'Mechanism Research',
  avatar: 'Avatar Profiling',
  synthesis: 'Synthesis',
};

export default function ClickUpPage() {
  // SSE for pending count updates, SWR for full sync list
  const { data: _pending } = useSSE<{ total_pending: number; by_offer: Record<string, number> }>(
    '/sse/clickup',
    { fallbackPath: '/clickup/pending-summary', fallbackInterval: 30_000 }
  );
  const { data: syncs = [], isLoading, mutate: refreshSyncs } = useSWR<ClickUpSync[]>(
    '/clickup-syncs',
    apiFetch,
    { refreshInterval: 30_000 }
  );

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-mono text-[var(--hud-text)]">ClickUp Sync</h1>

      {isLoading ? (
        <p className="text-xs font-mono text-[var(--hud-text-dim)] animate-pulse">Loading sync status...</p>
      ) : syncs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-[var(--hud-text-dim)]">
          <p className="text-sm font-mono mb-2">No ClickUp syncs configured</p>
          <p className="text-xs opacity-50">Set up with: /clickup-setup [offer-path]</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="border border-[var(--hud-border)] rounded p-3 bg-[var(--hud-surface)]">
              <p className="text-[10px] font-mono text-[var(--hud-text-dim)] mb-1">Synced Offers</p>
              <p className="text-2xl font-mono text-[var(--hud-accent)]">{syncs.length}</p>
            </div>
            <div className="border border-[var(--hud-border)] rounded p-3 bg-[var(--hud-surface)]">
              <p className="text-[10px] font-mono text-[var(--hud-text-dim)] mb-1">Total Tasks</p>
              <p className="text-2xl font-mono text-[var(--hud-text)]">
                {syncs.reduce((sum, s) => sum + s.task_count, 0)}
              </p>
            </div>
            <div className="border border-[var(--hud-border)] rounded p-3 bg-[var(--hud-surface)]">
              <p className="text-[10px] font-mono text-[var(--hud-text-dim)] mb-1">Last Sync</p>
              <p className="text-sm font-mono text-[var(--hud-text)]">
                {syncs.length > 0
                  ? new Date(
                      syncs.reduce((latest, s) =>
                        new Date(s.last_synced) > new Date(latest) ? s.last_synced : latest,
                        syncs[0].last_synced
                      )
                    ).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
                  : '-'}
              </p>
            </div>
          </div>

          {/* Per-offer sync status */}
          <div>
            <h2 className="text-sm font-mono text-[var(--hud-text)] mb-2">Synced Offers</h2>
            <div className="border border-[var(--hud-border)] rounded overflow-hidden">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="bg-[var(--hud-surface)]">
                    <th className="text-left px-3 py-2 text-[var(--hud-text-dim)]">Offer</th>
                    <th className="text-right px-3 py-2 text-[var(--hud-text-dim)]">Tasks</th>
                    <th className="text-right px-3 py-2 text-[var(--hud-text-dim)]">Last Synced</th>
                    <th className="text-right px-3 py-2 text-[var(--hud-text-dim)]">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {syncs.map((s, i) => {
                    const lastSync = new Date(s.last_synced);
                    const hoursSince = (Date.now() - lastSync.getTime()) / (1000 * 60 * 60);
                    const syncStatus = hoursSince < 1 ? 'recent' : hoursSince < 24 ? 'ok' : 'stale';

                    return (
                      <tr key={i} className="border-t border-[var(--hud-border)]">
                        <td className="px-3 py-2 text-[var(--hud-text)]">{s.offer}</td>
                        <td className="px-3 py-2 text-right text-[var(--hud-text)]">{s.task_count}</td>
                        <td className="px-3 py-2 text-right text-[var(--hud-text-dim)]">
                          {lastSync.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="px-3 py-2 text-right">
                          <Badge variant={syncStatus === 'recent' ? 'passed' : syncStatus === 'ok' ? 'active' : 'failed'}>
                            {syncStatus === 'recent' ? 'synced' : syncStatus === 'ok' ? 'ok' : 'stale'}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sync executor per offer */}
          {syncs.map((s, i) => (
            <SyncExecutor key={`exec-${i}`} offer={s.offer} />
          ))}

          {/* Sync details expandable */}
          {syncs.map((s, i) => (
            <SyncDetail key={i} offer={s.offer} />
          ))}
        </div>
      )}
    </div>
  );
}

function SyncDetail({ offer }: { offer: string }) {
  const { data } = useSWR<ClickUpDetail>(
    `/clickup/${offer}`,
    apiFetch,
    { refreshInterval: 60_000 }
  );

  if (!data?.sync) return null;
  const sync = data.sync;

  return (
    <details className="border border-[var(--hud-border)] rounded bg-[var(--hud-surface)]">
      <summary className="px-3 py-2 cursor-pointer text-xs font-mono text-[var(--hud-text)] hover:text-[var(--hud-accent)]">
        {offer} — Task Map
      </summary>
      <div className="px-3 pb-3 space-y-3">
        {/* Phase Tasks */}
        <div>
          <p className="text-[10px] font-mono text-[var(--hud-text-dim)] mb-1 uppercase tracking-wider">Phases (10)</p>
          <div className="grid grid-cols-5 gap-1">
            {Object.entries(sync.phase_tasks || {}).map(([key, id]) => (
              <div key={key} className="text-[9px] font-mono px-1.5 py-1 rounded bg-[var(--hud-bg)] text-[var(--hud-text-dim)] truncate" title={`${key}: ${id}`}>
                {key.replace('fase_', 'F')}
              </div>
            ))}
          </div>
        </div>

        {/* Gate Tasks */}
        <div>
          <p className="text-[10px] font-mono text-[var(--hud-text-dim)] mb-1 uppercase tracking-wider">Gates (3)</p>
          <div className="flex gap-2">
            {Object.entries(sync.gate_tasks || {}).map(([key, id]) => (
              <div key={key} className="text-[9px] font-mono px-2 py-1 rounded bg-[var(--hud-bg)] text-[var(--hud-text-dim)]">
                {GATE_LABELS[key] || key}
              </div>
            ))}
          </div>
        </div>

        {/* Deliverable Tasks */}
        <div>
          <p className="text-[10px] font-mono text-[var(--hud-text-dim)] mb-1 uppercase tracking-wider">Deliverables (4)</p>
          <div className="flex gap-2">
            {Object.entries(sync.deliverable_tasks || {}).map(([key, id]) => (
              <div key={key} className="text-[9px] font-mono px-2 py-1 rounded bg-[var(--hud-bg)] text-[var(--hud-text-dim)]">
                {DELIVERABLE_LABELS[key] || key}
              </div>
            ))}
          </div>
        </div>

        {/* Research Tasks */}
        <div>
          <p className="text-[10px] font-mono text-[var(--hud-text-dim)] mb-1 uppercase tracking-wider">Research (5)</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(sync.research_tasks || {}).map(([key, id]) => (
              <div key={key} className="text-[9px] font-mono px-2 py-1 rounded bg-[var(--hud-bg)] text-[var(--hud-text-dim)]">
                {RESEARCH_LABELS[key] || key}
              </div>
            ))}
          </div>
        </div>

        {/* Errors */}
        {Array.isArray(sync.sync_errors) && sync.sync_errors.length > 0 && (
          <div>
            <p className="text-[10px] font-mono text-red-400 mb-1 uppercase tracking-wider">Recent Errors</p>
            {sync.sync_errors.slice(-3).map((e, i) => (
              <p key={i} className="text-[9px] font-mono text-red-300/70">
                {typeof e === 'object' ? `[${e.operation}] ${e.error}` : String(e)}
              </p>
            ))}
          </div>
        )}
      </div>
    </details>
  );
}
