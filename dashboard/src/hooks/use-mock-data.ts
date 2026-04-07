'use client';

import { useEffect } from 'react';
import { useAgentStore } from '@/stores/agent-store';
import { useOfferStore } from '@/stores/offer-store';
import { useHelixStore } from '@/stores/helix-store';
import { useMonitorStore } from '@/stores/monitor-store';
import { generateAllMockData } from '@/lib/mock-data';

/**
 * Hook that populates zustand stores with mock data.
 * Bypasses real API calls (SSE, WebSocket, HTTP polling).
 * Enable via NEXT_PUBLIC_MOCK_MODE environment variable.
 */
export function useMockData() {
  const { setAgents } = useAgentStore();
  const { setOffers } = useOfferStore();
  const { setPhases } = useHelixStore();
  const { addEvents } = useMonitorStore();

  useEffect(() => {
    const isMockMode = process.env.NEXT_PUBLIC_MOCK_MODE === 'true';
    if (!isMockMode) return;

    // Generate all mock data
    const mockData = generateAllMockData();

    // Populate stores
    setAgents(mockData.agents);
    setOffers(mockData.offers);
    setPhases(mockData.helixPhases);
    addEvents(mockData.monitorEvents);

    console.log('[MOCK MODE] Initialized with sample data:', {
      agents: mockData.agents.length,
      offers: mockData.offers.length,
      phases: mockData.helixPhases.length,
      events: mockData.monitorEvents.length,
    });
  }, [setAgents, setOffers, setPhases, addEvents]);
}
