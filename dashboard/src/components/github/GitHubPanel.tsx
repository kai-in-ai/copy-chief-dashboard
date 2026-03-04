'use client';

import { GitBranch, GitPullRequest, CircleDot, ArrowUp, ArrowDown, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { GitHubData, RepoInfo } from '@/hooks/use-github';

interface GitHubPanelProps {
  data: GitHubData;
}

function RepoCard({ repo }: { repo: RepoInfo }) {
  const hasUnpushed = repo.ahead > 0;
  const hasPending = repo.pending_changes > 0;

  return (
    <div className="border border-[var(--hud-border)] rounded p-3 bg-[var(--hud-surface)] space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GitBranch size={14} className="text-[var(--hud-accent)]" />
          <span className="text-xs font-mono font-bold text-[var(--hud-text)]">{repo.name}</span>
          <span className="text-[10px] font-mono text-[var(--hud-text-dim)]">{repo.branch}</span>
        </div>
        <div className="flex items-center gap-2">
          {hasUnpushed && (
            <span className="flex items-center gap-0.5 text-[10px] font-mono text-yellow-400">
              <ArrowUp size={10} /> {repo.ahead}
            </span>
          )}
          {repo.behind > 0 && (
            <span className="flex items-center gap-0.5 text-[10px] font-mono text-blue-400">
              <ArrowDown size={10} /> {repo.behind}
            </span>
          )}
          {hasPending && (
            <span className="flex items-center gap-0.5 text-[10px] font-mono text-orange-400">
              <Clock size={10} /> {repo.pending_changes}
            </span>
          )}
        </div>
      </div>

      {/* Recent commits */}
      {repo.commits.length > 0 && (
        <div className="space-y-0.5">
          {repo.commits.map((c, i) => {
            const isChore = c.message.startsWith('chore');
            return (
              <div key={c.hash} className={`flex gap-2 text-[10px] font-mono ${i === 0 ? 'text-[var(--hud-text)]' : 'text-[var(--hud-text-dim)]'}`}>
                <span className="text-[var(--hud-accent)] shrink-0">{c.hash}</span>
                <span className={isChore ? 'opacity-50' : ''}>{c.message}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function GitHubPanel({ data }: GitHubPanelProps) {
  const repos = data.repos || [];

  return (
    <div className="space-y-4">
      {/* Repos */}
      {repos.length > 0 ? (
        <div className="space-y-3">
          {repos.map(repo => (
            <RepoCard key={repo.name} repo={repo} />
          ))}
        </div>
      ) : (
        /* Fallback for old API format */
        <div className="flex items-center gap-3 border border-[var(--hud-border)] rounded p-3 bg-[var(--hud-surface)]">
          <GitBranch size={16} className="text-[var(--hud-accent)]" />
          <div>
            <p className="text-xs font-mono text-[var(--hud-text)]">{data.branch}</p>
            <p className="text-[10px] font-mono text-[var(--hud-text-dim)]">{data.last_commit}</p>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex gap-4 text-[9px] font-mono text-[var(--hud-text-dim)]">
        <span className="flex items-center gap-1"><ArrowUp size={9} className="text-yellow-400" /> unpushed</span>
        <span className="flex items-center gap-1"><ArrowDown size={9} className="text-blue-400" /> behind</span>
        <span className="flex items-center gap-1"><Clock size={9} className="text-orange-400" /> pending</span>
        <span>Refreshes every 60s via polling</span>
      </div>

      {/* Pull Requests */}
      <div>
        <h3 className="text-xs font-mono text-[var(--hud-text)] mb-2 flex items-center gap-2">
          <GitPullRequest size={14} /> Pull Requests ({data.prs.length})
        </h3>
        {data.prs.length === 0 ? (
          <p className="text-[10px] font-mono text-[var(--hud-text-dim)]">No open PRs</p>
        ) : (
          <div className="space-y-2">
            {data.prs.map(pr => (
              <a
                key={pr.number}
                href={pr.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block border border-[var(--hud-border)] rounded p-2 bg-[var(--hud-surface)] hover:border-[var(--hud-accent)]/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[var(--hud-text)]">#{pr.number} {pr.title}</span>
                  <Badge variant={pr.state === 'OPEN' ? 'success' : 'default'}>{pr.state}</Badge>
                </div>
                <p className="text-[10px] font-mono text-[var(--hud-text-dim)] mt-0.5">{pr.author}</p>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Issues */}
      <div>
        <h3 className="text-xs font-mono text-[var(--hud-text)] mb-2 flex items-center gap-2">
          <CircleDot size={14} /> Issues ({data.issues.length})
        </h3>
        {data.issues.length === 0 ? (
          <p className="text-[10px] font-mono text-[var(--hud-text-dim)]">No open issues</p>
        ) : (
          <div className="space-y-2">
            {data.issues.map(issue => (
              <a
                key={issue.number}
                href={issue.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block border border-[var(--hud-border)] rounded p-2 bg-[var(--hud-surface)] hover:border-[var(--hud-accent)]/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[var(--hud-text)]">#{issue.number} {issue.title}</span>
                  <Badge variant={issue.state === 'OPEN' ? 'warning' : 'default'}>{issue.state}</Badge>
                </div>
                {issue.labels.length > 0 && (
                  <div className="flex gap-1 mt-1">
                    {issue.labels.map(l => (
                      <span key={l} className="text-[9px] font-mono bg-[var(--hud-border)] text-[var(--hud-text-dim)] rounded px-1">{l}</span>
                    ))}
                  </div>
                )}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
