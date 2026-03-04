'use client';

import { useSettingsStore } from '@/stores/settings-store';

const INTERVALS = [
  { label: '5s', value: 5_000 },
  { label: '10s', value: 10_000 },
  { label: '30s', value: 30_000 },
  { label: '1m', value: 60_000 },
];

export default function SettingsPage() {
  const {
    theme, autoRefresh, refreshInterval, showStandbyOffers,
    setTheme, setAutoRefresh, setRefreshInterval, setShowStandbyOffers,
  } = useSettingsStore();

  return (
    <div className="space-y-6 max-w-lg">
      <h1 className="text-lg font-mono text-[var(--hud-text)]">Settings</h1>

      {/* Theme */}
      <div className="space-y-2">
        <label className="text-xs font-mono text-[var(--hud-text-dim)] uppercase tracking-wider">Theme</label>
        <div className="flex gap-2">
          {(['dark', 'light', 'system'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`text-xs font-mono px-3 py-1.5 rounded border transition-colors ${
                theme === t
                  ? 'border-[var(--hud-accent)] text-[var(--hud-accent)] bg-[var(--hud-accent)]/10'
                  : 'border-[var(--hud-border)] text-[var(--hud-text-dim)] hover:text-[var(--hud-text)]'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Auto Refresh */}
      <div className="space-y-2">
        <label className="text-xs font-mono text-[var(--hud-text-dim)] uppercase tracking-wider">Auto Refresh</label>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
              autoRefresh ? 'bg-[var(--hud-accent)]' : 'bg-[var(--hud-border)]'
            }`}
          >
            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
              autoRefresh ? 'translate-x-4' : 'translate-x-1'
            }`} />
          </button>
          <span className="text-xs font-mono text-[var(--hud-text)]">
            {autoRefresh ? 'Enabled' : 'Disabled'}
          </span>
        </div>
      </div>

      {/* Refresh Interval */}
      {autoRefresh && (
        <div className="space-y-2">
          <label className="text-xs font-mono text-[var(--hud-text-dim)] uppercase tracking-wider">Refresh Interval</label>
          <div className="flex gap-2">
            {INTERVALS.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setRefreshInterval(value)}
                className={`text-xs font-mono px-3 py-1.5 rounded border transition-colors ${
                  refreshInterval === value
                    ? 'border-[var(--hud-accent)] text-[var(--hud-accent)] bg-[var(--hud-accent)]/10'
                    : 'border-[var(--hud-border)] text-[var(--hud-text-dim)] hover:text-[var(--hud-text)]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Show Standby Offers */}
      <div className="space-y-2">
        <label className="text-xs font-mono text-[var(--hud-text-dim)] uppercase tracking-wider">Show Standby Offers</label>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowStandbyOffers(!showStandbyOffers)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
              showStandbyOffers ? 'bg-[var(--hud-accent)]' : 'bg-[var(--hud-border)]'
            }`}
          >
            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
              showStandbyOffers ? 'translate-x-4' : 'translate-x-1'
            }`} />
          </button>
          <span className="text-xs font-mono text-[var(--hud-text)]">
            {showStandbyOffers ? 'Showing all' : 'Active only'}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="border-t border-[var(--hud-border)] pt-4 space-y-1">
        <p className="text-[10px] font-mono text-[var(--hud-text-dim)]">Dashboard Port: 4001</p>
        <p className="text-[10px] font-mono text-[var(--hud-text-dim)]">Settings persisted in localStorage</p>
      </div>
    </div>
  );
}
