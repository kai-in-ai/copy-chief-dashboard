'use client';

import useSWR from 'swr';
import { apiFetch, cn } from '@/lib/utils';

interface Stats {
  total: number;
  by_type: Array<{ type: string; count: number }>;
  by_tool: Array<{ tool_name: string; count: number }>;
  errors: number;
  success_rate: string;
  sessions_active: number;
}

interface HourlyBucket {
  hour: number;
  count: number;
}

interface DailyBucket {
  day: string;
  count: number;
}

export function StatsOverview() {
  const { data: stats } = useSWR<Stats>('/stats', apiFetch, { refreshInterval: 60_000 });
  const { data: hourly = [] } = useSWR<HourlyBucket[]>('/stats/hourly', apiFetch, { refreshInterval: 120_000 });
  const { data: daily = [] } = useSWR<DailyBucket[]>('/stats/daily', apiFetch, { refreshInterval: 120_000 });

  if (!stats) return null;

  const successRate = parseFloat(stats.success_rate) / 100;
  const maxHourly = Math.max(...hourly.map((h) => h.count), 1);
  const maxDaily = Math.max(...daily.map((d) => d.count), 1);

  const cards = [
    { label: 'Total Events', value: stats.total.toLocaleString(), color: 'text-[var(--hud-accent)]' },
    { label: 'Success Rate', value: `${stats.success_rate}%`, color: successRate >= 0.9 ? 'text-emerald-400' : 'text-amber-400' },
    { label: 'Active Sessions', value: stats.sessions_active.toString(), color: 'text-[var(--hud-accent)]' },
    { label: 'Errors', value: stats.errors.toLocaleString(), color: stats.errors > 0 ? 'text-red-400' : 'text-emerald-400' },
  ];

  return (
    <div className="space-y-4">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {cards.map((c) => (
          <div
            key={c.label}
            className="border border-[var(--hud-border)] rounded p-3 bg-[var(--hud-surface)]"
          >
            <p className="text-[10px] font-mono text-[var(--hud-text-dim)] uppercase tracking-wider">{c.label}</p>
            <p className={cn('text-lg font-mono font-bold', c.color)}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Top Tools */}
      {stats.by_tool.length > 0 && (
        <div className="border border-[var(--hud-border)] rounded p-3 bg-[var(--hud-surface)]">
          <p className="text-[10px] font-mono text-[var(--hud-text-dim)] uppercase tracking-wider mb-2">Top Tools</p>
          <div className="space-y-1">
            {stats.by_tool.slice(0, 8).map((t) => {
              const pct = stats.total > 0 ? (t.count / stats.total) * 100 : 0;
              return (
                <div key={t.tool_name} className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-[var(--hud-text-dim)] w-[120px] truncate">{t.tool_name}</span>
                  <div className="flex-1 h-1.5 bg-[var(--hud-bg)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[var(--hud-accent-dim)]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-[var(--hud-text)] w-8 text-right">{t.count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Activity Charts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Hourly Activity (24h) */}
        {hourly.length > 0 && (
          <div className="border border-[var(--hud-border)] rounded p-3 bg-[var(--hud-surface)]">
            <p className="text-[10px] font-mono text-[var(--hud-text-dim)] uppercase tracking-wider mb-2">Hourly Activity (24h)</p>
            <div className="flex items-end gap-[2px] h-12">
              {Array.from({ length: 24 }, (_, i) => {
                const bucket = hourly.find((h) => h.hour === i);
                const count = bucket?.count || 0;
                const pct = (count / maxHourly) * 100;
                return (
                  <div
                    key={i}
                    className="flex-1 rounded-t bg-[var(--hud-accent-dim)] transition-all hover:bg-[var(--hud-accent)]"
                    style={{ height: `${Math.max(pct, 2)}%` }}
                    title={`${i}h: ${count} events`}
                  />
                );
              })}
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[8px] font-mono text-[var(--hud-text-dim)]">0h</span>
              <span className="text-[8px] font-mono text-[var(--hud-text-dim)]">12h</span>
              <span className="text-[8px] font-mono text-[var(--hud-text-dim)]">23h</span>
            </div>
          </div>
        )}

        {/* Daily Activity (14d) */}
        {daily.length > 0 && (
          <div className="border border-[var(--hud-border)] rounded p-3 bg-[var(--hud-surface)]">
            <p className="text-[10px] font-mono text-[var(--hud-text-dim)] uppercase tracking-wider mb-2">Daily Activity (14d)</p>
            <div className="flex items-end gap-1 h-12">
              {daily.slice(-14).map((d) => {
                const pct = (d.count / maxDaily) * 100;
                return (
                  <div
                    key={d.day}
                    className="flex-1 rounded-t bg-emerald-500/60 transition-all hover:bg-emerald-400/80"
                    style={{ height: `${Math.max(pct, 2)}%` }}
                    title={`${d.day}: ${d.count} events`}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
