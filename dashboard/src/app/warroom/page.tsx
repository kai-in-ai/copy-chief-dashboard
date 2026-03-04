'use client';

import { useWarRoom } from '@/hooks/use-warroom';
import { WarRoomAgentStrip } from '@/components/warroom/WarRoomAgentStrip';
import { TaskKanbanBoard } from '@/components/warroom/TaskKanbanBoard';
import { WarRoomActivityFeed } from '@/components/warroom/WarRoomActivityFeed';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { Badge } from '@/components/ui/badge';

export default function WarRoomPage() {
  const {
    agents, entries, workflowSteps, activityFeed,
    filters, setAgentFilter, setOfferFilter,
    isLoading, isSSE,
  } = useWarRoom();

  const activeCount = agents.filter(a => a.status === 'working').length;
  const pendingTasks = entries.filter(e => e.status === 'pending').length;
  const uniqueOffers = new Set(entries.map(e => e.offer)).size;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-mono text-[var(--hud-text)]">War Room</h1>
          <Badge variant={isSSE ? 'success' : 'warning'}>
            {isSSE ? 'LIVE' : 'POLLING'}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono">
          <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            {activeCount} active
          </span>
          <span className="px-2 py-1 rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/30">
            {pendingTasks} pending
          </span>
          <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30">
            {uniqueOffers} offers
          </span>
          {filters.agentFilter && (
            <button
              onClick={() => { setAgentFilter(null); setOfferFilter(null); }}
              className="px-2 py-1 rounded bg-[var(--hud-accent)]/10 text-[var(--hud-accent)] border border-[var(--hud-accent)]/30 hover:bg-[var(--hud-accent)]/20"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <p className="text-xs font-mono text-[var(--hud-text-dim)] animate-pulse">Loading war room...</p>
      ) : (
        <>
          {/* Agent Strip */}
          <ErrorBoundary section="Agent Strip">
            <div className="border border-[var(--hud-border)] rounded-lg p-3 bg-[var(--hud-surface)]">
              <WarRoomAgentStrip
                agents={agents}
                activeFilter={filters.agentFilter}
                onAgentClick={setAgentFilter}
              />
            </div>
          </ErrorBoundary>

          {/* Task Kanban Board */}
          <ErrorBoundary section="Task Kanban">
            <div className="border border-[var(--hud-border)] rounded-lg p-3 bg-[var(--hud-bg)]">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-mono font-bold text-[var(--hud-text-dim)] uppercase tracking-wider">
                  Task Board
                </h2>
                <span className="text-[10px] font-mono text-[var(--hud-text-dim)]">
                  {entries.length} dispatch + {workflowSteps.length} workflow
                </span>
              </div>
              <TaskKanbanBoard
                entries={entries}
                workflowSteps={workflowSteps}
                agentFilter={filters.agentFilter}
                offerFilter={filters.offerFilter}
              />
            </div>
          </ErrorBoundary>

          {/* Activity Feed */}
          <ErrorBoundary section="Activity Feed">
            <div className="border border-[var(--hud-border)] rounded-lg p-3 bg-[var(--hud-surface)]">
              <h2 className="text-xs font-mono font-bold text-[var(--hud-text-dim)] uppercase tracking-wider mb-2">
                Activity Feed
              </h2>
              <WarRoomActivityFeed
                events={activityFeed}
                agentFilter={filters.agentFilter}
                offerFilter={filters.offerFilter}
              />
            </div>
          </ErrorBoundary>
        </>
      )}

      <p className="text-[10px] font-mono text-[var(--hud-text-dim)]">
        {agents.length} personas | {entries.length + workflowSteps.length} tasks | Real-time via {isSSE ? 'SSE' : 'HTTP polling'}
      </p>
    </div>
  );
}
