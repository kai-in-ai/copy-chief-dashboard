'use client';

import { useMonitorStore, type MonitorEvent } from '@/stores/monitor-store';
import { cn } from '@/lib/utils';

function selectCurrentTool(events: MonitorEvent[]): MonitorEvent | undefined {
  const preToolUses = events.filter((e) => e.type === 'PreToolUse');
  const postToolUses = events.filter((e) => e.type === 'PostToolUse');

  for (const pre of preToolUses) {
    const hasPost = postToolUses.some(
      (post) =>
        post.tool_name === pre.tool_name &&
        post.session_id === pre.session_id &&
        post.timestamp > pre.timestamp
    );
    if (!hasPost) return pre;
  }
  return undefined;
}

function getToolSummary(event: MonitorEvent): string {
  const input = event.tool_input;
  if (!input) return '';

  switch (event.tool_name) {
    case 'Read':
    case 'Write':
    case 'Edit':
      return (input.file_path as string)?.split('/').slice(-2).join('/') || '';
    case 'Bash':
      return ((input.command as string) || '').slice(0, 40);
    case 'Grep':
      return `/${input.pattern as string}/` || '';
    case 'Glob':
      return (input.pattern as string) || '';
    case 'Task':
      return (input.description as string) || '';
    default:
      return event.tool_name?.replace(/^mcp__\w+__/, '') || '';
  }
}

export function CurrentToolIndicator() {
  const events = useMonitorStore((s) => s.events);
  const currentTool = selectCurrentTool(events);

  if (!currentTool) return null;

  const toolName = currentTool.tool_name || 'unknown';
  const summary = getToolSummary(currentTool);

  return (
    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-amber-500/30 bg-amber-500/5">
      <span className={cn('w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse')} />
      <span className="text-[10px] font-mono text-amber-400 font-bold">
        {toolName}
      </span>
      {summary && (
        <span className="text-[10px] font-mono text-[var(--hud-text-dim)] truncate max-w-[150px]">
          {summary}
        </span>
      )}
    </div>
  );
}
