'use client';

import { useGitHub } from '@/hooks/use-github';
import { GitHubPanel } from '@/components/github/GitHubPanel';
import { ErrorBoundary } from '@/components/ui/error-boundary';

export default function GitHubPage() {
  const { data, isLoading } = useGitHub();

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-mono text-[var(--hud-text)]">GitHub</h1>

      {isLoading || !data ? (
        <p className="text-xs font-mono text-[var(--hud-text-dim)] animate-pulse">Loading GitHub data...</p>
      ) : (
        <ErrorBoundary section="GitHub">
          <GitHubPanel data={data} />
        </ErrorBoundary>
      )}

      <p className="text-[10px] font-mono text-[var(--hud-text-dim)]">
        Refreshes every 60s via polling
      </p>
    </div>
  );
}
