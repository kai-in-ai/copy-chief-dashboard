'use client';

import useSWR from 'swr';
import { apiFetch } from '@/lib/utils';

export interface RepoInfo {
  name: string;
  path: string;
  branch: string;
  tracking: string | null;
  ahead: number;
  behind: number;
  commits: { hash: string; message: string }[];
  pending_changes: number;
}

export interface GitHubData {
  branch: string;
  last_commit: string;
  repos: RepoInfo[];
  prs: { number: number; title: string; state: string; url: string; author: string }[];
  issues: { number: number; title: string; state: string; url: string; labels: string[] }[];
}

export function useGitHub() {
  return useSWR<GitHubData>('/github', apiFetch, { refreshInterval: 60_000 });
}
