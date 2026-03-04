import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(ts: number): string {
  return new Date(ts).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
  });
}

export function formatRelativeTime(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60_000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}min ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

export function formatScore(score: number): string {
  return score.toFixed(1);
}

export function scoreColor(score: number): string {
  if (score >= 8) return 'text-emerald-400';
  if (score >= 7) return 'text-yellow-400';
  return 'text-red-400';
}

export function phaseToColumn(phase: string): string {
  const p = phase.toUpperCase();
  if (['IDLE', 'UNDEFINED'].includes(p)) return 'IDLE';
  if (['RESEARCH', 'VOC', 'FUNDAMENTOS', 'AVATAR'].includes(p)) return 'RESEARCH';
  if (['BRIEFING', 'PROBLEMA_VILAO_MUP', 'SOLUCAO_MUS', 'RESEARCH_GATE', 'BRIEFING_GATE'].includes(p)) return 'BRIEFING';
  // Offers never leave PRODUCTION — always producing materials
  if (['PRODUCTION', 'PRODUCAO', 'VALIDACAO', 'DELIVERED', 'ENTREGA', 'COMPLETE'].includes(p)) return 'PRODUCTION';
  return 'IDLE';
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

export async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}
