'use client';

import useSWR from 'swr';
import { useHelixStore, type HelixPhase } from '@/stores/helix-store';
import { useOfferStore } from '@/stores/offer-store';
import { apiFetch } from '@/lib/utils';
import { useEffect } from 'react';

interface HelixResponse {
  offer: string;
  current_phase: string;
  phases: HelixPhase[];
  gates: Record<string, boolean>;
}

export function useHelix() {
  const selectedOffer = useOfferStore((s) => s.selectedOffer);
  const { setPhases, setCurrentPhase, setGates, setLoading } = useHelixStore();

  const { data, error, isLoading } = useSWR<HelixResponse>(
    selectedOffer ? `/helix/${selectedOffer}` : null,
    apiFetch,
    { refreshInterval: 15_000 }
  );

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  useEffect(() => {
    if (data) {
      setPhases(data.phases);
      setCurrentPhase(data.current_phase);
      setGates(data.gates);
    }
  }, [data, setPhases, setCurrentPhase, setGates]);

  return { data, error, isLoading };
}
