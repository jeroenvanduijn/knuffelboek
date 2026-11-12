'use client';

import { useEffect } from 'react';
import { WEBAPP_URL } from '@/lib/constants';
import { bewaarBron, leesBron, linkMetBron } from '@/lib/bron';

/**
 * Onthoudt via welke link de bezoeker binnenkwam (advertentie, reel, link in de bio) en zet die bron
 * op elke knop naar de app. Toont zelf niets.
 */
export default function BronDoorgeven() {
  useEffect(() => {
    bewaarBron(window.location.search);

    const zetOpLink = (event: Event) => {
      const doel = event.target as Element | null;
      const link = doel?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!link || !link.href.startsWith(WEBAPP_URL)) return;
      link.href = linkMetBron(link.href, leesBron());
    };

    // pointerdown en keydown komen vóór de klik: ook "open in nieuw tabblad" krijgt zo de goede link.
    const soorten = ['pointerdown', 'keydown', 'click'] as const;
    soorten.forEach((soort) => document.addEventListener(soort, zetOpLink, true));
    return () => soorten.forEach((soort) => document.removeEventListener(soort, zetOpLink, true));
  }, []);

  return null;
}
