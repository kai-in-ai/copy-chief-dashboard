'use client';

import { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { TerminalLine } from '@/stores/terminal-store';

interface TerminalPanelProps {
  sessionId: string;
  lines: TerminalLine[];
  expanded?: boolean;
  onExpand?: () => void;
}

export function TerminalPanel({ sessionId, lines, expanded, onExpand }: TerminalPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines.length]);

  const shortId = sessionId.split('-').slice(-2).join('-');

  return (
    <div
      className={cn(
        'border border-[var(--hud-border)] rounded bg-black/50 flex flex-col',
        expanded ? 'col-span-full' : ''
      )}
    >
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-[var(--hud-border)] bg-[var(--hud-surface)]">
        <span className="text-[10px] font-mono text-[var(--hud-accent)]">{shortId}</span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-[var(--hud-text-dim)]">{lines.length} lines</span>
          {onExpand && (
            <button
              onClick={onExpand}
              className="text-[10px] font-mono text-[var(--hud-text-dim)] hover:text-[var(--hud-text)]"
            >
              {expanded ? 'Grid' : 'Expand'}
            </button>
          )}
        </div>
      </div>
      <div
        ref={scrollRef}
        className={cn(
          'overflow-auto font-mono text-[11px] p-2 space-y-0.5',
          expanded ? 'h-[500px]' : 'h-[250px]'
        )}
      >
        {lines.length === 0 ? (
          <p className="text-[var(--hud-text-dim)] opacity-50">No output yet</p>
        ) : (
          lines.map((line, i) => (
            <div key={i} className={cn('leading-tight', line.is_error ? 'text-red-400' : 'text-green-300/80')}>
              <span className="text-[var(--hud-text-dim)] opacity-40 mr-2">
                {new Date(line.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
              <span className="text-cyan-400/60 mr-1">[{line.tool_name?.split('__').pop() || 'sys'}]</span>
              <span>{line.text}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
