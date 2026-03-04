'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, AlertCircle, Wrench } from 'lucide-react';
import { cn, formatRelativeTime } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { MonitorEvent } from '@/stores/monitor-store';

interface ActivityFeedProps {
  events: MonitorEvent[];
}

export function ActivityFeed({ events }: ActivityFeedProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-[var(--hud-text-dim)]">
        <Activity className="w-8 h-8 mb-2 opacity-30" />
        <p className="text-sm font-mono">No events yet</p>
        <p className="text-xs opacity-50">Waiting for WebSocket connection...</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {events.slice(0, 100).map((event) => {
        const isOpen = expanded.has(event.id);
        const isTool = !!event.tool_name;

        return (
          <div
            key={event.id}
            className={cn(
              'border border-[var(--hud-border)] rounded px-3 py-2 transition-colors',
              event.is_error ? 'border-red-500/30 bg-red-500/5' : 'bg-[var(--hud-surface)]'
            )}
          >
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => isTool && toggle(event.id)}
            >
              {isTool ? (
                isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />
              ) : (
                <span className="w-3.5" />
              )}

              {event.is_error ? (
                <AlertCircle size={14} className="text-red-400 shrink-0" />
              ) : (
                <Wrench size={14} className="text-[var(--hud-text-dim)] shrink-0" />
              )}

              <span className="text-xs font-mono text-[var(--hud-text)] truncate flex-1">
                {event.tool_name || event.type}
              </span>

              {event.offer && (
                <Badge variant="info">{event.offer}</Badge>
              )}

              {event.phase && (
                <Badge variant="active">{event.phase}</Badge>
              )}

              <span className="text-[10px] font-mono text-[var(--hud-text-dim)] shrink-0">
                {formatRelativeTime(event.timestamp)}
              </span>
            </div>

            {isOpen && isTool && (
              <div className="mt-2 pl-6 space-y-1">
                {event.tool_input && (
                  <div>
                    <span className="text-[10px] font-mono text-[var(--hud-text-dim)]">INPUT:</span>
                    <pre className="text-[10px] font-mono text-[var(--hud-text)] mt-0.5 max-h-32 overflow-auto whitespace-pre-wrap bg-black/30 rounded p-2">
                      {JSON.stringify(event.tool_input, null, 2).slice(0, 2000)}
                    </pre>
                  </div>
                )}
                {event.tool_result && (
                  <div>
                    <span className="text-[10px] font-mono text-[var(--hud-text-dim)]">RESULT:</span>
                    <pre className="text-[10px] font-mono text-[var(--hud-text)] mt-0.5 max-h-32 overflow-auto whitespace-pre-wrap bg-black/30 rounded p-2">
                      {event.tool_result.slice(0, 2000)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Activity({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h4l3-9 4 18 3-9h4" />
    </svg>
  );
}
