'use client';

import { useMetricsTrend, useMetricsByOffer } from '@/hooks/use-metrics';
import { MetricsSummary } from '@/components/insights/MetricsSummary';
import { StatsOverview } from '@/components/insights/StatsOverview';
import { PatternsSection } from '@/components/insights/PatternsSection';
import { JourneysSection } from '@/components/insights/JourneysSection';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { ScoreBadge } from '@/components/ui/score-badge';
import { Badge } from '@/components/ui/badge';
import { formatScore, scoreColor } from '@/lib/utils';
import { cn } from '@/lib/utils';

const TOOL_LABELS: Record<string, string> = {
  'mcp__copywriting__blind_critic': 'Blind Critic',
  'mcp__copywriting__emotional_stress_test': 'EST',
  'mcp__copywriting__black_validation': 'BLACK Validation',
  'mcp__copywriting__layered_review': 'Layered Review',
};

export default function InsightsPage() {
  const { data: trend = [], isLoading: trendLoading } = useMetricsTrend(30);
  const { data: byOffer = [], isLoading: offerLoading } = useMetricsByOffer();

  // Group trend by tool
  const toolGroups = trend.reduce<Record<string, typeof trend>>((acc, m) => {
    const key = m.tool;
    if (!acc[key]) acc[key] = [];
    acc[key].push(m);
    return acc;
  }, {});

  const isLoading = trendLoading || offerLoading;

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-mono text-[var(--hud-text)]">Insights</h1>

      {/* System Stats */}
      <ErrorBoundary section="Stats">
        <StatsOverview />
      </ErrorBoundary>

      {isLoading ? (
        <p className="text-xs font-mono text-[var(--hud-text-dim)] animate-pulse">Loading metrics...</p>
      ) : trend.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-[var(--hud-text-dim)]">
          <p className="text-sm font-mono mb-2">No metrics data yet</p>
          <p className="text-xs opacity-50">Metrics will appear after running validation tools</p>
          <p className="text-[10px] opacity-30 mt-1">blind_critic, emotional_stress_test, black_validation</p>
        </div>
      ) : (
        <>
          {/* Tool summary cards with sparklines */}
          <MetricsSummary trend={trend} />

          {/* Recent by tool */}
          <div>
            <h2 className="text-sm font-mono text-[var(--hud-text)] mb-3">Recent Trend (30 days)</h2>
            <div className="border border-[var(--hud-border)] rounded overflow-hidden">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="bg-[var(--hud-surface)]">
                    <th className="text-left px-3 py-2 text-[var(--hud-text-dim)]">Date</th>
                    <th className="text-left px-3 py-2 text-[var(--hud-text-dim)]">Tool</th>
                    <th className="text-right px-3 py-2 text-[var(--hud-text-dim)]">Avg Score</th>
                    <th className="text-right px-3 py-2 text-[var(--hud-text-dim)]">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {trend.slice(0, 20).map((m, i) => (
                    <tr key={i} className="border-t border-[var(--hud-border)]">
                      <td className="px-3 py-1.5 text-[var(--hud-text)]">{m.date}</td>
                      <td className="px-3 py-1.5 text-[var(--hud-text)]">
                        {TOOL_LABELS[m.tool] || m.tool.split('__').pop()}
                      </td>
                      <td className={cn('px-3 py-1.5 text-right', scoreColor(m.avg_score))}>
                        {formatScore(m.avg_score)}
                      </td>
                      <td className="px-3 py-1.5 text-right text-[var(--hud-text-dim)]">{m.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* By offer */}
          {byOffer.length > 0 && (
            <div>
              <h2 className="text-sm font-mono text-[var(--hud-text)] mb-3">By Offer</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {byOffer.map((m, i) => (
                  <div
                    key={i}
                    className="border border-[var(--hud-border)] rounded p-3 bg-[var(--hud-surface)]"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant="info">{m.offer}</Badge>
                      <ScoreBadge score={m.avg_score} />
                    </div>
                    <p className="text-[10px] font-mono text-[var(--hud-text-dim)]">
                      {m.tool ? (TOOL_LABELS[m.tool] || m.tool.split('__').pop()) : ''} {m.count} runs
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Patterns — independent of metrics trend data */}
      <ErrorBoundary section="Patterns">
        <PatternsSection />
      </ErrorBoundary>

      {/* Journeys — independent of metrics trend data */}
      <ErrorBoundary section="Journeys">
        <JourneysSection />
      </ErrorBoundary>
    </div>
  );
}
