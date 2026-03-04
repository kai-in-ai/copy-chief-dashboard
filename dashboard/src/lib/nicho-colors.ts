export const NICHO_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  saude: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400' },
  concursos: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400' },
  relacionamento: { bg: 'bg-pink-500/10', border: 'border-pink-500/30', text: 'text-pink-400' },
  riqueza: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400' },
};

export function getNichoColor(nicho: string) {
  return NICHO_COLORS[nicho.toLowerCase()] || { bg: 'bg-zinc-500/10', border: 'border-zinc-500/30', text: 'text-zinc-400' };
}
