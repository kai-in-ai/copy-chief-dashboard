'use client';

import { cn, formatScore, scoreColor } from '@/lib/utils';
import { Sparkline } from './Sparkline';
import type { MetricPoint } from '@/hooks/use-metrics';

const TOOL_CONFIG: Record<string, { label: string; color: string }> = {
  'mcp__copywriting__blind_critic': { label: 'Blind Critic', color: '#3b82f6' },
  'mcp__copywriting__emotional_stress_test': { label: 'EST', color: '#f59e0b' },
  'mcp__copywriting__black_validation': { label: 'BLACK', color: '#10b981' },
  'mcp__copywriting__layered_review': { label: 'Layered Review', color: '#8b5cf6' },
};

interface MetricsSummaryProps {
  trend: MetricPoint[];
}

export function MetricsSummary({ trend }: MetricsSummaryProps) {
  // Group by tool
  const toolGroups: Record<string, MetricPoint[]> = {};
  for (const m of trend) {
    if (!toolGroups[m.tool]) toolGroups[m.tool] = [];
    toolGroups[m.tool].push(m);
  }

  const tools = Object.entries(toolGroups);

  if (tools.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-xs font-mono text-[var(--hud-text-dim)]">No metrics data yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {tools.map(([tool, points]) => {
        const config = TOOL_CONFIG[tool] || { label: tool.split('__').pop() || tool, color: '#94a3b8' };
        const avg = points.reduce((s, p) => s + p.avg_score, 0) / points.length;
        const total = points.reduce((s, p) => s + p.count, 0);
        const latest = points[points.length - 1]?.avg_score ?? 0;
        const first = points[0]?.avg_score ?? 0;
        const trending = latest >= first ? 'up' : 'down';

        const sparkData = points.map((p) => ({ date: p.date, value: p.avg_score }));

        return (
          <div
            key={tool}
            className="border border-[var(--hud-border)] rounded p-4 bg-[var(--hud-surface)]"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-mono text-[var(--hud-text-dim)] uppercase tracking-wider">
                {config.label}
              </p>
              <span className={cn(
                'text-[10px] font-mono',
                trending === 'up' ? 'text-emerald-400' : 'text-red-400'
              )}>
                {trending === 'up' ? '↑' : '↓'}
              </span>
            </div>

            <div className="flex items-end justify-between mb-3">
              <span className={cn('text-2xl font-mono font-bold', scoreColor(avg))}>
                {formatScore(avg)}
              </span>
              <span className="text-[10px] font-mono text-[var(--hud-text-dim)]">
                {total} runs
              </span>
            </div>

            <Sparkline
              data={sparkData}
              threshold={8}
              color={config.color}
              width={180}
              height={32}
              className="w-full"
            />
          </div>
        );
      })}
    </div>
  );
}
