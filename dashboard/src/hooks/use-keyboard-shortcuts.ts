'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useOfferStore } from '@/stores/offer-store';

const ROUTES: Record<string, string> = {
  '1': '/monitor',
  '2': '/kanban',
  '3': '/helix',
  '4': '/pipeline',
  '5': '/squad',
  '6': '/insights',
  '7': '/clickup',
};

export function useKeyboardShortcuts() {
  const router = useRouter();
  const selectOffer = useOfferStore((s) => s.selectOffer);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Ignore when typing in inputs
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      // Esc — clear selection
      if (e.key === 'Escape') {
        selectOffer(null);
        return;
      }

      // Number keys 1-7 — navigate
      if (!e.ctrlKey && !e.metaKey && !e.altKey && ROUTES[e.key]) {
        router.push(ROUTES[e.key]);
        return;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router, selectOffer]);
}
