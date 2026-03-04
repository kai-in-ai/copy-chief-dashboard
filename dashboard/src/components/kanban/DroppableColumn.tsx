import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';

const COLUMN_COLORS: Record<string, string> = {
  IDLE: 'border-zinc-600',
  RESEARCH: 'border-[var(--phase-research)]',
  BRIEFING: 'border-amber-500',
  PRODUCTION: 'border-violet-500',
};

interface DroppableColumnProps {
  id: string;
  name: string;
  children: React.ReactNode;
}

export function DroppableColumn({ id, name, children }: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className="flex flex-col min-w-[220px] flex-1" ref={setNodeRef}>
      <div
        className={cn(
          'flex items-center justify-between px-3 py-2 border-t-2 rounded-t bg-[var(--hud-surface)]',
          COLUMN_COLORS[name] || 'border-zinc-600'
        )}
      >
        <h2 className="text-xs font-mono font-bold text-[var(--hud-text)] uppercase tracking-wider">
          {name}
        </h2>
      </div>
      <div
        className={cn(
          'flex-1 space-y-2 p-2 border border-t-0 border-[var(--hud-border)] rounded-b min-h-[200px] transition-colors',
          isOver ? 'bg-[var(--hud-accent)]/5' : 'bg-[var(--hud-bg)]'
        )}
      >
        {children}
      </div>
    </div>
  );
}
