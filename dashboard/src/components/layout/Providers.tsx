'use client';

import { useOffers } from '@/hooks/use-offers';
import { useMonitorEvents } from '@/hooks/use-monitor-events';
import { useOfferStore } from '@/stores/offer-store';
import { useHelixStore } from '@/stores/helix-store';
import { useEffect } from 'react';

/**
 * Global data providers — initialized once in the root layout.
 * - Loads offers from /offers API (refreshes every 30s)
 * - Connects WebSocket for live events (always-on)
 * - Syncs selectedOffer phase to helixStore.currentPhase
 */
export function Providers({ children }: { children: React.ReactNode }) {
  // Always fetch offers globally (populates offer-store)
  useOffers();

  // Always connect WebSocket globally (populates monitor-store)
  useMonitorEvents();

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
