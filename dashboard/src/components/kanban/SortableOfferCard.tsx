'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { OfferCard } from './OfferCard';
import type { OfferStatus } from '@/stores/offer-store';

interface SortableOfferCardProps {
  offer: OfferStatus;
}

export function SortableOfferCard({ offer }: SortableOfferCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `${offer.nicho}/${offer.name}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <OfferCard offer={offer} />
    </div>
  );
}
