'use client';

import { useOffers } from '@/hooks/use-offers';
import { useMonitorEvents } from '@/hooks/use-monitor-events';
import { useMockData } from '@/hooks/use-mock-data';
import { useOfferStore } from '@/stores/offer-store';
import { useHelixStore } from '@/stores/helix-store';
import { useEffect } from 'react';

/**
 * Global data providers — initialized once in the root layout.
 * - Loads offers from /offers API (refreshes every 30s)
 * - Connects WebSocket for live events (always-on)
 * - Syncs selectedOffer phase to helixStore.currentPhase
 *
 * When NEXT_PUBLIC_MOCK_MODE=true, uses mock data instead of real APIs.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const isMockMode = process.env.NEXT_PUBLIC_MOCK_MODE === 'true';

  // Initialize mock data (only runs in mock mode)
  useMockData();

  // In production mode, fetch offers and events from real APIs
  if (!isMockMode) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useOffers();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useMonitorEvents();
  }

  // Sync selected offer's phase to helix store for StatusBar display
  const selectedOffer = useOfferStore((s) => s.selectedOffer);
  const offers = useOfferStore((s) => s.offers);
  const setCurrentPhase = useHelixStore((s) => s.setCurrentPhase);

  useEffect(() => {
    if (selectedOffer && offers.length > 0) {
      const match = offers.find(
        (o) => `${o.nicho}/${o.name}` === selectedOffer
      );
      if (match) {
        setCurrentPhase(match.phase.toUpperCase());
      }
    } else if (!selectedOffer) {
      setCurrentPhase('IDLE');
    }
  }, [selectedOffer, offers, setCurrentPhase]);

  return <>{children}</>;  
}
