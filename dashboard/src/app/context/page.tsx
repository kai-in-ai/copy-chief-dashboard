'use client';

import { useContext } from '@/hooks/use-context';
import { RulesTree } from '@/components/context/RulesTree';
import { McpStatus } from '@/components/context/McpStatus';
import { ContextPanel } from '@/components/context/ContextPanel';
import { ErrorBoundary } from '@/components/ui/error-boundary';

export default function ContextPage() {
  const { data, isLoading } = useContext();

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-mono text-[var(--hud-text)]">Context</h1>

      {isLoading || !data ? (
        <p className="text-xs font-mono text-[var(--hud-text-dim)] animate-pulse">Loading context...</p>
      ) : (
        <div className="space-y-4">
          {/* Rules */}
          <ErrorBoundary section="Rules">
            <RulesTree rules={data.rules} />
          </ErrorBoundary>

          {/* MCPs */}
          <ErrorBoundary section="MCPs">
            <McpStatus mcps={data.mcps} />
          </ErrorBoundary>

          {/* Context Panels */}
          <ErrorBoundary section="Context Panels">
            <ContextPanel data={data} />
          </ErrorBoundary>
        </div>
      )}

      <p className="text-[10px] font-mono text-[var(--hud-text-dim)]">
        System context — rules, agents, config, MCPs
      </p>
    </div>
  );
}
