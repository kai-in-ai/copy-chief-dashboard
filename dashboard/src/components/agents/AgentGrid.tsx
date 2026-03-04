'use client';

import { AgentCard } from './AgentCard';
import type { AgentStatus } from '@/stores/agent-store';

interface AgentGridProps {
  agents: AgentStatus[];
  selectedAgent: string | null;
  onAgentClick: (name: string) => void;
}

export function AgentGrid({ agents, selectedAgent, onAgentClick }: AgentGridProps) {
  const working = agents.filter(a => a.status === 'working');
  const idle = agents.filter(a => a.status !== 'working');

  return (
    <div className="space-y-4">
      {working.length > 0 && (
        <div>
          <h3 className="text-xs font-mono text-emerald-400 mb-2 uppercase tracking-wider">Active ({working.length})</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {working.map(a => (
              <AgentCard
                key={a.name}
                agent={a}
                selected={selectedAgent === a.name}
                onClick={() => onAgentClick(a.name)}
              />
            ))}
          </div>
        </div>
      )}

      <div>
        {working.length > 0 && (
          <h3 className="text-xs font-mono text-[var(--hud-text-dim)] mb-2 uppercase tracking-wider">Idle ({idle.length})</h3>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {idle.map(a => (
            <AgentCard
              key={a.name}
              agent={a}
              selected={selectedAgent === a.name}
              onClick={() => onAgentClick(a.name)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
