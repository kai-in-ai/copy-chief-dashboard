export const PERSONA_COLORS: Record<string, { color: string; bg: string; border: string; label: string }> = {
  chief:      { color: 'var(--persona-chief)',      bg: 'var(--persona-chief-bg)',      border: 'var(--persona-chief-border)',      label: 'Helix' },
  researcher: { color: 'var(--persona-researcher)', bg: 'var(--persona-researcher-bg)', border: 'var(--persona-researcher-border)', label: 'Vox' },
  briefer:    { color: 'var(--persona-briefer)',    bg: 'var(--persona-briefer-bg)',    border: 'var(--persona-briefer-border)',    label: 'Atlas' },
  producer:   { color: 'var(--persona-producer)',   bg: 'var(--persona-producer-bg)',   border: 'var(--persona-producer-border)',   label: 'Blade' },
  critic:     { color: 'var(--persona-critic)',     bg: 'var(--persona-critic-bg)',     border: 'var(--persona-critic-border)',     label: 'Hawk' },
  creative:   { color: 'var(--persona-creative)',   bg: 'var(--persona-creative-bg)',   border: 'var(--persona-creative-border)',   label: 'Scout' },
  lp:         { color: 'var(--persona-lp)',         bg: 'var(--persona-lp-bg)',         border: 'var(--persona-lp-border)',         label: 'Forge' },
  vsl:        { color: 'var(--persona-vsl)',        bg: 'var(--persona-vsl-bg)',        border: 'var(--persona-vsl-border)',        label: 'Echo' },
  miner:      { color: 'var(--persona-miner)',      bg: 'var(--persona-miner-bg)',      border: 'var(--persona-miner-border)',      label: 'Cipher' },
  gatekeeper: { color: 'var(--persona-gatekeeper)', bg: 'var(--persona-gatekeeper-bg)', border: 'var(--persona-gatekeeper-border)', label: 'Sentinel' },
};

export function getPersonaColor(handle: string) {
  return PERSONA_COLORS[handle.toLowerCase()] || PERSONA_COLORS.chief;
}
