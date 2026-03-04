'use client';

import { useEffect } from 'react';
import { useTerminalStore } from '@/stores/terminal-store';
import { useMonitorStore } from '@/stores/monitor-store';
import { TerminalGrid } from '@/components/terminals/TerminalGrid';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { Badge } from '@/components/ui/badge';

export default function TerminalsPage() {
  const lines = useTerminalStore((s) => s.lines);
  const activeSession = useTerminalStore((s) => s.activeSession);
  const viewMode = useTerminalStore((s) => s.viewMode);
  const setActiveSession = useTerminalStore((s) => s.setActiveSession);
  const setViewMode = useTerminalStore((s) => s.setViewMode);
  const addLine = useTerminalStore((s) => s.addLine);
  const events = useMonitorStore((s) => s.events);

  // Feed monitor events into terminal lines
  useEffect(() => {
    const recentEvents = events
      .filter(e => e.type === 'PostToolUse' && e.session_id)
      .slice(0, 50);

    for (const evt of recentEvents) {
      const sessionId = evt.session_id!;
      const existing = lines.get(sessionId) || [];
      const alreadyExists = existing.some(l => l.timestamp === evt.timestamp && l.tool_name === (evt.tool_name || ''));
      if (!alreadyExists) {
        addLine(sessionId, {
          timestamp: evt.timestamp,
          session_id: sessionId,
          tool_name: evt.tool_name || '',
          text: evt.tool_result?.substring(0, 200) || `${evt.tool_name} completed`,
          is_error: evt.is_error || false,
        });
      }
    }
  // Only trigger on events length change to avoid infinite loops
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events.length]);

  const handleExpand = (sessionId: string | null) => {
    if (sessionId) {
      setActiveSession(sessionId);
      setViewMode('single');
    } else {
      setActiveSession(null);
      setViewMode('grid');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-mono text-[var(--hud-text)]">Terminals</h1>
        <div className="flex items-center gap-2">
          <Badge variant="default">{lines.size} sessions</Badge>
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'single' : 'grid')}
            className="text-xs font-mono text-[var(--hud-text-dim)] hover:text-[var(--hud-text)] border border-[var(--hud-border)] rounded px-2 py-1"
          >
            {viewMode === 'grid' ? 'Single View' : 'Grid View'}
          </button>
        </div>
      </div>

      <ErrorBoundary section="Terminal Grid">
        <TerminalGrid
          sessions={lines}
          activeSession={activeSession}
          viewMode={viewMode}
          onExpand={handleExpand}
        />
      </ErrorBoundary>

      <p className="text-[10px] font-mono text-[var(--hud-text-dim)]">
        Tool outputs from active sessions — Click Expand for single-panel view
      </p>
    </div>
  );
}
