'use client';

import { cn } from '@/lib/utils';
import type { AgentStatus } from '@/stores/agent-store';

interface WarRoomAgentStripProps {
  agents: AgentStatus[];
  activeFilter: string | null;
  onAgentClick: (agent: string | null) => void;
}

export function WarRoomAgentStrip({ agents, activeFilter, onAgentClick }: WarRoomAgentStripProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
      {agents.map((agent) => {
        const isActive = agent.status === 'working';
        const isFiltered = activeFilter === agent.name;

        return (
          <button
            key={agent.name}
            onClick={() => onAgentClick(isFiltered ? null : agent.name)}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg border transition-all shrink-0',
              'hover:bg-[var(--hud-surface)]',
              isFiltered
                ? 'border-[var(--hud-accent)] bg-[var(--hud-accent)]/10'
                : 'border-[var(--hud-border)] bg-[var(--hud-surface)]',
              isActive && !isFiltered && 'border-emerald-500/50'
            )}
          >
            {/* Agent avatar */}
            <div className="relative">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-black"
                style={{ backgroundColor: agent.color }}
              >
                {agent.initial}
              </div>
              {isActive && (
                <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
              )}
            </div>

            {/* Agent info */}
            <div className="text-left min-w-0">
              <p className="text-[10px] font-mono font-bold text-[var(--hud-text)] leading-tight">
                {agent.name}
              </p>
              {isActive && agent.current_task ? (
                <p className="text-[9px] font-mono text-emerald-400 truncate max-w-[120px]">
                  {agent.current_task}
                </p>
              ) : (
                <p className="text-[9px] font-mono text-[var(--hud-text-dim)]">
                  {agent.role}
                </p>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
