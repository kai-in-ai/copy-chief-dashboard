'use client';

import { useEffect } from 'react';
import { useClickUpStore } from '@/stores/clickup-store';
import { Badge } from '@/components/ui/badge';

interface SyncExecutorProps {
  offer: string;
}

export function SyncExecutor({ offer }: SyncExecutorProps) {
  const { pendingByOffer, executing, lastResult, lastError, fetchPending, executePending } =
    useClickUpStore();

  const pending = pendingByOffer[offer] || [];
  const isExecuting = executing === offer;

  useEffect(() => {
    fetchPending(offer);
    const interval = setInterval(() => fetchPending(offer), 30_000);
    return () => clearInterval(interval);
  }, [offer, fetchPending]);

  if (pending.length === 0 && !lastResult && !lastError) return null;

  return (
    <div className="border border-[var(--hud-border)] rounded p-3 bg-[var(--hud-surface)]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <p className="text-[10px] font-mono text-[var(--hud-text-dim)] uppercase tracking-wider">
            Pending Updates
          </p>
          {pending.length > 0 && (
            <Badge variant="active">{pending.length}</Badge>
          )}
        </div>
        {pending.length > 0 && (
          <button
            onClick={() => executePending(offer)}
            disabled={isExecuting}
            className="text-[10px] font-mono px-3 py-1.5 rounded border border-[var(--hud-border)] text-[var(--hud-accent)] hover:bg-[var(--hud-accent-bg)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {isExecuting ? 'Executing...' : 'Execute Sync'}
          </button>
        )}
      </div>

      {/* Pending list */}
      {pending.length > 0 && (
        <div className="space-y-1 mb-2">
          {pending.map((p, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-2 py-1 rounded bg-[var(--hud-bg)] text-[9px] font-mono"
            >
              <span className="text-[var(--hud-text-dim)]">{p.task_id.slice(0, 8)}...</span>
              <Badge variant="pending">{p.action}</Badge>
            </div>
          ))}
        </div>
      )}

      {/* Execution progress */}
      {isExecuting && (
        <div className="flex items-center gap-2 py-2">
          <div className="w-3 h-3 rounded-full border-2 border-[var(--hud-accent)] border-t-transparent animate-spin" />
          <span className="text-[10px] font-mono text-[var(--hud-text-dim)]">
            Processing {pending.length} updates...
          </span>
        </div>
      )}

      {/* Result */}
      {lastResult && (
        <div className="mt-2 px-2 py-1.5 rounded bg-[var(--hud-bg)]">
          <div className="flex items-center gap-2">
            <Badge variant={lastResult.errors.length === 0 ? 'passed' : 'failed'}>
              {lastResult.errors.length === 0 ? 'Success' : 'Partial'}
            </Badge>
            <span className="text-[9px] font-mono text-[var(--hud-text-dim)]">
              {lastResult.processed} processed
              {lastResult.errors.length > 0 && `, ${lastResult.errors.length} errors`}
            </span>
          </div>
          {lastResult.errors.length > 0 && (
            <div className="mt-1 space-y-0.5">
              {lastResult.errors.map((err, i) => (
                <p key={i} className="text-[9px] font-mono text-red-400">{err}</p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {lastError && (
        <div className="mt-2 px-2 py-1.5 rounded bg-red-500/5 border border-red-500/20">
          <p className="text-[9px] font-mono text-red-400">{lastError}</p>
        </div>
      )}
    </div>
  );
}
