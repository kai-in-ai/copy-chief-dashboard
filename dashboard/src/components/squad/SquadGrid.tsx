import { ExpertCard } from './ExpertCard';

interface Expert {
  id: string;
  name: string;
  tier: string;
  specialties: string[];
  style: string;
  avg_quality: number;
  reviews_count: number;
}

interface SquadGridProps {
  experts: Expert[];
  onExpertClick?: (id: string) => void;
  selectedExpert?: string | null;
}

export function SquadGrid({ experts, onExpertClick, selectedExpert }: SquadGridProps) {
  if (experts.length === 0) {
    return (
      <p className="text-sm font-mono text-[var(--hud-text-dim)] text-center py-8">
        No experts match filter
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {experts.map((expert) => (
        <ExpertCard
          key={expert.id}
          expert={expert}
          onClick={onExpertClick ? () => onExpertClick(expert.id) : undefined}
          isSelected={selectedExpert === expert.id}
        />
      ))}
    </div>
  );
}
