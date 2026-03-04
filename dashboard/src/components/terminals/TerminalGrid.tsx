'use client';

import { TerminalPanel } from './TerminalPanel';
import type { TerminalLine } from '@/stores/terminal-store';

interface TerminalGridProps {
  sessions: Map<string, TerminalLine[]>;
  activeSession: string | null;
  viewMode: 'grid' | 'single';
  onExpand: (sessionId: string | null) => void;
}

export function TerminalGrid({ sessions, activeSession, viewMode, onExpand }: TerminalGridProps) {
  const entries = Array.from(sessions.entries())
    .sort(([, a], [, b]) => {
      const lastA = a.length > 0 ? a[a.length - 1].timestamp : 0;
      const lastB = b.length > 0 ? b[b.length - 1].timestamp : 0;
      return lastB - lastA;
    });

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-[var(--hud-text-dim)]">
        <p className="text-sm font-mono mb-2">No terminal sessions</p>
        <p className="text-xs opacity-50">Terminal output will appear as agents execute tools</p>
      </div>
    );
  }

  if (viewMode === 'single' && activeSession) {
    const lines = sessions.get(activeSession) || [];
    return (
      <TerminalPanel
        sessionId={activeSession}
        lines={lines}
        expanded
        onExpand={() => onExpand(null)}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
      {entries.map(([sessionId, lines]) => (
        <TerminalPanel
          key={sessionId}
          sessionId={sessionId}
          lines={lines}
          onExpand={() => onExpand(sessionId)}
        />
      ))}
    </div>
  );
}
