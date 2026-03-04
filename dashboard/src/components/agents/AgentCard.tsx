'use client';

import { cn } from '@/lib/utils';
import { formatRelativeTime } from '@/lib/utils';
import type { AgentStatus } from '@/stores/agent-store';

interface AgentCardProps {
  agent: AgentStatus;
  onClick?: () => void;
  selected?: boolean;
}

export function AgentCard({ agent, onClick, selected }: AgentCardProps) {
  const isWorking = agent.status === 'working';
  const isError = agent.status === 'error';

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative text-left border rounded p-3 transition-all w-full',
        'bg-[var(--hud-surface)] border-[var(--hud-border)]',
        'hover:border-[var(--hud-accent)]/40',
        selected && 'border-[var(--hud-accent)] ring-1 ring-[var(--hud-accent)]/30',
      )}
    >
      {/* Pulse indicator */}
      {isWorking && (
        <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: agent.color }} />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ backgroundColor: agent.color }} />
        </span>
      )}
      {isError && (
        <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
        </span>
      )}

      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-black"
          style={{ backgroundColor: agent.color }}
        >
          {agent.initial}
        </div>
        <div>
          <p className="text-sm font-mono text-[var(--hud-text)]">{agent.name}</p>
          <p className="text-[10px] font-mono text-[var(--hud-text-dim)]">{agent.handle}</p>
        </div>
      </div>

      <p className="text-[11px] font-mono text-[var(--hud-text-dim)] mb-1">{agent.role}</p>

      {agent.current_task && (
        <p className="text-[10px] font-mono text-[var(--hud-accent)] truncate">{agent.current_task}</p>
      )}
      {agent.assigned_offer && (
        <p className="text-[10px] font-mono text-[var(--hud-text-dim)]">{agent.assigned_offer}</p>
      )}
      {agent.last_seen && (
        <p className="text-[10px] font-mono text-[var(--hud-text-dim)] opacity-50 mt-1">
          {formatRelativeTime(new Date(agent.last_seen).getTime())}
        </p>
      )}
    </button>
  );
}
