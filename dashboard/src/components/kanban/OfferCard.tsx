'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatRelativeTime } from '@/lib/utils';
import { getNichoColor } from '@/lib/nicho-colors';
import { Badge } from '@/components/ui/badge';
import { ScoreBadge } from '@/components/ui/score-badge';
import { useOfferStore, type OfferStatus } from '@/stores/offer-store';
import { useDispatchStore } from '@/stores/dispatch-store';

const MECANISMO_ICONS: Record<string, { icon: string; label: string }> = {
  UNDEFINED: { icon: '○', label: 'Undefined' },
  DRAFT: { icon: '✎', label: 'Draft' },
  PENDING_VALIDATION: { icon: '◔', label: 'Pending' },
  VALIDATED: { icon: '✓', label: 'Validated' },
  APPROVED: { icon: '✓✓', label: 'Approved' },
};

const DELIVERABLE_LABELS: Record<string, string> = {
  vsl: 'VSL',
  lp: 'LP',
  criativos: 'ADS',
  emails: 'EM',
};

interface OfferCardProps {
  offer: OfferStatus;
}

const AGENT_COLORS: Record<string, string> = {
  helix: '#FFD700', vox: '#10B981', atlas: '#3B82F6', blade: '#EF4444',
  hawk: '#F59E0B', scout: '#06B6D4', forge: '#8B5CF6', echo: '#EC4899',
  cipher: '#14B8A6', sentinel: '#E8ECF4', ops: '#78716C', strategist: '#D97706',
};

const STATUS_DOT: Record<string, string> = {
  pending: 'bg-yellow-500',
  dispatched: 'bg-blue-500',
  completed: 'bg-emerald-500',
  failed: 'bg-red-500',
  skipped: 'bg-gray-500',
};

export function OfferCard({ offer }: OfferCardProps) {
  const { selectedOffer, selectOffer } = useOfferStore();
  const [tasksExpanded, setTasksExpanded] = useState(false);
  const dispatchEntries = useDispatchStore((s) => s.entries);
  const offerSlug = `${offer.nicho}/${offer.name}`;
  const offerTasks = dispatchEntries.filter((e) => e.offer === offerSlug);
  const isSelected = selectedOffer === offerSlug;
  const mec = MECANISMO_ICONS[offer.mecanismo_state] || MECANISMO_ICONS.UNDEFINED;
  const nichoColor = getNichoColor(offer.nicho);
  const isActive = !!offer.active_agent;

  return (
    <div
      onClick={() => selectOffer(`${offer.nicho}/${offer.name}`)}
      className={cn(
        'p-3 rounded border cursor-pointer transition-all relative',
        isSelected
          ? 'border-[var(--hud-accent)] bg-[var(--hud-accent)]/5 shadow-[0_0_8px_var(--hud-accent-dim)]'
          : 'border-[var(--hud-border)] bg-[var(--hud-surface)] hover:border-[var(--hud-text-dim)]'
      )}
    >
      {/* Active pulse indicator */}
      {isActive && (
        <span className="absolute top-2 right-2 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
      )}

      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-mono text-[var(--hud-text)] leading-tight">
          {offer.name}
        </h3>
        <span className={cn('px-1.5 py-0.5 rounded text-[9px] font-mono font-bold border', nichoColor.bg, nichoColor.border, nichoColor.text)}>
          {offer.nicho}
        </span>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] font-mono text-[var(--hud-text-dim)]">MEC:</span>
        <Badge
          variant={
            offer.mecanismo_state === 'APPROVED' ? 'passed' :
            offer.mecanismo_state === 'VALIDATED' ? 'passed' :
            offer.mecanismo_state === 'DRAFT' ? 'active' : 'pending'
          }
        >
          {mec.icon} {mec.label}
        </Badge>
      </div>

      {/* Deliverables breakdown */}
      {offer.deliverables && offer.production_count > 0 && (
        <div className="flex items-center gap-1.5 mb-2">
          {Object.entries(offer.deliverables).map(([key, count]) => (
            count > 0 && (
              <span
                key={key}
                className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[var(--hud-bg)] border border-[var(--hud-border)] text-[var(--hud-text-dim)]"
              >
                {DELIVERABLE_LABELS[key] || key}:{count}
              </span>
            )
          ))}
        </div>
      )}

      {/* Active agent */}
      {isActive && (
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-[9px] font-mono text-emerald-400">
            {offer.active_agent} working
          </span>
          {offer.last_activity && (
            <span className="text-[9px] font-mono text-[var(--hud-text-dim)]">
              {formatRelativeTime(offer.last_activity)}
            </span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono text-[var(--hud-text-dim)]">
          {offer.production_count} produced
        </span>
        {offer.avg_quality > 0 && (
          <ScoreBadge score={offer.avg_quality} label="Q:" />
        )}
      </div>

      {/* RMBC mini-bars */}
      {offer.rmbc && Object.keys(offer.rmbc).length > 0 && (
        <div className="mt-2 pt-2 border-t border-[var(--hud-border)]">
          <p className="text-[9px] font-mono text-[var(--hud-text-dim)] mb-1 uppercase tracking-wider">RMBC</p>
          <div className="space-y-1">
            {(['digerivel', 'unico', 'provavel', 'conectado'] as const).map((key) => {
              const val = offer.rmbc?.[key];
              if (val === undefined) return null;
              return (
                <div key={key} className="flex items-center gap-1.5">
                  <span className="text-[8px] font-mono text-[var(--hud-text-dim)] w-[14px]">
                    {key[0].toUpperCase()}
                  </span>
                  <div className="flex-1 h-1 bg-[var(--hud-bg)] rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full',
                        val >= 8 ? 'bg-emerald-500' : val >= 7 ? 'bg-amber-500' : 'bg-red-500'
                      )}
                      style={{ width: `${(val / 10) * 100}%` }}
                    />
                  </div>
                  <span className="text-[8px] font-mono text-[var(--hud-text-dim)] w-3 text-right">{val}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quality scores */}
      {(offer.blind_critic_score || offer.est_score) && (
        <div className="mt-1.5 flex gap-2">
          {offer.blind_critic_score !== undefined && (
            <span className={cn(
              'text-[9px] font-mono',
              offer.blind_critic_score >= 8 ? 'text-emerald-400' : offer.blind_critic_score >= 7 ? 'text-amber-400' : 'text-red-400'
            )}>
              BC:{offer.blind_critic_score}
            </span>
          )}
          {offer.est_score !== undefined && (
            <span className={cn(
              'text-[9px] font-mono',
              offer.est_score >= 8 ? 'text-emerald-400' : offer.est_score >= 7 ? 'text-amber-400' : 'text-red-400'
            )}>
              EST:{offer.est_score}
            </span>
          )}
        </div>
      )}

      {/* Dispatch Tasks (expandable) */}
      {offerTasks.length > 0 && (
        <div className="mt-2 pt-2 border-t border-[var(--hud-border)]">
          <button
            onClick={(e) => { e.stopPropagation(); setTasksExpanded(!tasksExpanded); }}
            className="flex items-center gap-1 text-[9px] font-mono text-[var(--hud-text-dim)] hover:text-[var(--hud-text)] w-full"
          >
            {tasksExpanded ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
            <span className="uppercase tracking-wider">{offerTasks.length} tasks</span>
          </button>
          {tasksExpanded && (
            <div className="mt-1 space-y-1">
              {offerTasks.slice(0, 8).map((task) => (
                <div key={task.id} className="flex items-center gap-1.5 text-[9px] font-mono">
                  <span
                    className="w-3 h-3 rounded-full shrink-0 flex items-center justify-center text-[6px] font-bold text-black"
                    style={{ backgroundColor: AGENT_COLORS[task.agent_id.toLowerCase()] || '#6B7280' }}
                  >
                    {task.agent_id[0]?.toUpperCase()}
                  </span>
                  <span className="truncate flex-1 text-[var(--hud-text)]">
                    {task.task_summary || 'No description'}
                  </span>
                  <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', STATUS_DOT[task.status] || 'bg-gray-500')} />
                </div>
              ))}
              {offerTasks.length > 8 && (
                <p className="text-[8px] text-[var(--hud-text-dim)]">+{offerTasks.length - 8} more</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
