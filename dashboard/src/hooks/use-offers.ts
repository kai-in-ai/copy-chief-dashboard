'use client';

import { useOfferStore } from '@/stores/offer-store';
import { useSSE } from '@/hooks/useSSE';
import { useEffect } from 'react';

interface OfferResponse {
  name: string;
  nicho: string;
  status?: 'active' | 'standby' | 'archived';
  phase: string;
  mecanismo_state: string;
  production_count: number;
  avg_quality: number;
}

export function useOffers() {
  const { setOffers, setLoading } = useOfferStore();

  const { data, isLoading, isSSE } = useSSE<OfferResponse[]>(
    '/sse/offers',
    { fallbackPath: '/offers', fallbackInterval: 30_000 }
  );

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  useEffect(() => {
    if (data) {
      setOffers(data);
    }
  }, [data, setOffers]);

  return { offers: data ?? [], error: null, isLoading, isSSE };
}
