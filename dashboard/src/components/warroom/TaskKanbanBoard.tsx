'use client';

import { cn, formatRelativeTime } from '@/lib/utils';
import type { DispatchEntry, WorkflowStep } from '@/stores/dispatch-store';

// Agent colors matching server AGENTS array
const AGENT_COLORS: Record<string, string> = {
  helix: '#FFD700', vox: '#10B981', atlas: '#3B82F6', blade: '#EF4444',
  hawk: '#F59E0B', scout: '#06B6D4', forge: '#8B5CF6', echo: '#EC4899',
  cipher: '#14B8A6', sentinel: '#E8ECF4', ops: '#78716C', strategist: '#D97706',
};

const COLUMNS = [
  { key: 'pending', label: 'PENDING', dotClass: 'bg-yellow-500' },
  { key: 'dispatched', label: 'IN PROGRESS', dotClass: 'bg-blue-500' },
  { key: 'completed', label: 'COMPLETED', dotClass: 'bg-emerald-500' },
  { key: 'failed', label: 'FAILED', dotClass: 'bg-red-500' },
] as const;

interface TaskKanbanBoardProps {
  entries: DispatchEntry[];
  workflowSteps: WorkflowStep[];
  agentFilter: string | null;
  offerFilter: string | null;
}

function normalizeStatus(status: string): string {
  const s = status.toLowerCase();
  if (s === 'in_progress' || s === 'dispatched' || s === 'active' || s === 'running') return 'dispatched';
  if (s === 'done' || s === 'completed' || s === 'passed') return 'completed';
  if (s === 'failed' || s === 'error') return 'failed';
  if (s === 'skipped') return 'completed';
  return 'pending';
}

export function TaskKanbanBoard({ entries, workflowSteps, agentFilter, offerFilter }: TaskKanbanBoardProps) {
  // Merge dispatch entries and workflow steps into unified list
  const allItems: DispatchEntry[] = [
    ...entries,
    ...workflowSteps.map((step) => ({
      id: step.id,
      offer: step.offer,
      agent_id: step.agent_id,
      model: '',
      status: normalizeStatus(step.status) as DispatchEntry['status'],
      task_summary: step.action,
      parallel_group: null,
      created_at: '',
      source: `workflow:${step.phase}`,
    })),
  ];

  // Apply filters
  const filtered = allItems.filter((item) => {
    if (agentFilter && item.agent_id.toLowerCase() !== agentFilter.toLowerCase()) return false;
    if (offerFilter && item.offer !== offerFilter) return false;
    return true;
  });

  // Group by column
  const columns = COLUMNS.map((col) => ({
    ...col,
    items: filtered.filter((item) => normalizeStatus(item.status) === col.key),
  }));

  if (filtered.length === 0) {
    const hasUnfiltered = allItems.length > 0;
    const activeFilter = agentFilter || offerFilter;
    return (
      <div className="flex flex-col items-center justify-center py-12 text-[var(--hud-text-dim)] gap-2">
        <p className="text-xs font-mono">
          {hasUnfiltered && activeFilter
            ? `No tasks for @${agentFilter || offerFilter} — ${allItems.length} tasks hidden by filter`
            : 'No dispatch tasks found'}
        </p>
        {hasUnfiltered && activeFilter && (
          <p className="text-[10px] font-mono opacity-50">Click the active agent again to clear filter</p>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-3 min-h-[200px]">
      {columns.map((col) => (
        <div key={col.key} className="flex flex-col">
          {/* Column header */}
          <div className="flex items-center gap-2 mb-2 px-1">
            <span className={cn('w-2 h-2 rounded-full', col.dotClass)} />
            <span className="text-[10px] font-mono font-bold text-[var(--hud-text-dim)] uppercase tracking-wider">
              {col.label}
            </span>
            <span className="text-[10px] font-mono text-[var(--hud-text-dim)]">
              {col.items.length}
            </span>
          </div>

          {/* Cards */}
          <div className="flex-1 space-y-1.5 overflow-y-auto max-h-[400px]">
            {col.items.map((item) => (
              <TaskCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function TaskCard({ item }: { item: DispatchEntry }) {
  const agentColor = AGENT_COLORS[item.agent_id.toLowerCase()] || '#6B7280';
  const offerName = item.offer.split('/').pop() || item.offer;

  return (
    <div className="p-2 rounded border border-[var(--hud-border)] bg-[var(--hud-surface)] hover:border-[var(--hud-text-dim)] transition-colors">
      {/* Agent badge + offer */}
      <div className="flex items-center justify-between mb-1">
        <span
          className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded text-black"
          style={{ backgroundColor: agentColor }}
        >
          {item.agent_id}
        </span>
        <span className="text-[9px] font-mono text-[var(--hud-text-dim)]">
          {offerName}
        </span>
      </div>

      {/* Task summary */}
      <p className="text-[10px] font-mono text-[var(--hud-text)] leading-snug line-clamp-2 mb-1">
        {item.task_summary || 'No description'}
      </p>

      {/* Footer: timestamp + model */}
      <div className="flex items-center justify-between">
        {item.created_at && (
          <span className="text-[8px] font-mono text-[var(--hud-text-dim)]">
            {formatRelativeTime(new Date(item.created_at).getTime())}
          </span>
        )}
        {item.model && (
          <span className="text-[8px] font-mono px-1 py-0.5 rounded bg-[var(--hud-bg)] text-[var(--hud-text-dim)]">
            {item.model}
          </span>
        )}
      </div>
    </div>
  );
}
