'use client';

import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { DroppableColumn } from './DroppableColumn';
import { SortableOfferCard } from './SortableOfferCard';
import { OfferCard } from './OfferCard';
import { useOfferStore, type OfferStatus } from '@/stores/offer-store';

const COLUMNS = ['IDLE', 'RESEARCH', 'BRIEFING', 'PRODUCTION'] as const;

interface DnDKanbanBoardProps {
  grouped: Record<string, OfferStatus[]>;
}

export function DnDKanbanBoard({ grouped }: DnDKanbanBoardProps) {
  const [activeOffer, setActiveOffer] = useState<OfferStatus | null>(null);
  const [pendingMove, setPendingMove] = useState<{ offer: OfferStatus; newPhase: string } | null>(null);
  const [moveError, setMoveError] = useState<string | null>(null);
  const [moving, setMoving] = useState(false);
  const moveOffer = useOfferStore((s) => s.moveOffer);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  function handleDragStart(event: DragStartEvent) {
    const offerId = event.active.id as string;
    for (const offers of Object.values(grouped)) {
      const found = offers.find((o) => `${o.nicho}/${o.name}` === offerId);
      if (found) {
        setActiveOffer(found);
        break;
      }
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveOffer(null);
    const { active, over } = event;
    if (!over) return;

    const offerId = active.id as string;
    const targetColumn = over.id as string;

    // Find the offer
    let offer: OfferStatus | undefined;
    for (const offers of Object.values(grouped)) {
      offer = offers.find((o) => `${o.nicho}/${o.name}` === offerId);
      if (offer) break;
    }
    if (!offer) return;

    // Check if actually moved to a different column
    const currentCol = findColumn(offerId, grouped);
    if (currentCol === targetColumn) return;

    // Show confirmation dialog
    setPendingMove({ offer, newPhase: targetColumn });
  }

  async function confirmMove() {
    if (!pendingMove) return;
    setMoveError(null);
    setMoving(true);
    const offerId = `${pendingMove.offer.nicho}/${pendingMove.offer.name}`;
    const result = await moveOffer(offerId, pendingMove.newPhase);
    setMoving(false);
    if (!result.ok) {
      setMoveError(result.error || 'Move failed');
      return;
    }
    setPendingMove(null);
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-3 overflow-x-auto pb-4">
          {COLUMNS.map((col) => (
            <DroppableColumn key={col} id={col} name={col}>
              <SortableContext
                items={(grouped[col] || []).map((o) => `${o.nicho}/${o.name}`)}
                strategy={verticalListSortingStrategy}
              >
                {(grouped[col] || []).map((offer) => (
                  <SortableOfferCard key={`${offer.nicho}/${offer.name}`} offer={offer} />
                ))}
              </SortableContext>
              {(grouped[col] || []).length === 0 && (
                <p className="text-[10px] font-mono text-[var(--hud-text-dim)] text-center py-8 opacity-40">
                  empty
                </p>
              )}
            </DroppableColumn>
          ))}
        </div>

        <DragOverlay>
          {activeOffer && <OfferCard offer={activeOffer} />}
        </DragOverlay>
      </DndContext>

      {/* Confirmation Dialog */}
      {pendingMove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="border border-[var(--hud-border)] rounded-lg p-6 bg-[var(--hud-bg)] max-w-sm w-full mx-4">
            <h3 className="text-sm font-mono text-[var(--hud-text)] font-bold mb-3">
              Move Offer?
            </h3>
            <p className="text-xs font-mono text-[var(--hud-text-dim)] mb-4">
              Move <span className="text-[var(--hud-text)]">{pendingMove.offer.nicho}/{pendingMove.offer.name}</span> to{' '}
              <span className="text-[var(--hud-accent)]">{pendingMove.newPhase}</span>?
            </p>
            <p className="text-[10px] font-mono text-yellow-400 mb-4">
              This will update helix-state.yaml for this offer.
            </p>
            {moveError && (
              <p className="text-[10px] font-mono text-red-400 mb-3 p-2 rounded bg-red-500/10 border border-red-500/20">
                {moveError}
              </p>
            )}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => { setPendingMove(null); setMoveError(null); }}
                className="text-[10px] font-mono px-3 py-1.5 rounded border border-[var(--hud-border)] text-[var(--hud-text-dim)] hover:text-[var(--hud-text)]"
                disabled={moving}
              >
                Cancel
              </button>
              <button
                onClick={confirmMove}
                className="text-[10px] font-mono px-3 py-1.5 rounded border border-[var(--hud-border)] text-[var(--hud-accent)] hover:bg-[var(--hud-accent-bg)]"
                disabled={moving}
              >
                {moving ? 'Moving...' : moveError ? 'Retry' : 'Confirm Move'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function findColumn(offerId: string, grouped: Record<string, OfferStatus[]>): string {
  for (const [col, offers] of Object.entries(grouped)) {
    if (offers.some((o) => `${o.nicho}/${o.name}` === offerId)) return col;
  }
  return 'IDLE';
}
