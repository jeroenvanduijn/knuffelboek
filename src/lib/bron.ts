import { WEBAPP_URL } from './constants';

/**
 * Bron van het bezoek: via welke link iemand op de site kwam (bijvoorbeeld een advertentie of een reel).
 * De site geeft die bron door aan de app, zodat we per boek zien waar de klant vandaan kwam.
 * Zonder dit telt elke bezoeker in de app als 'website', omdat alle knoppen utm_source=website meesturen.
 */
const VELDEN = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'thema'] as const;
export type Bron = Partial<Record<(typeof VELDEN)[number], string>>;

const SLEUTEL = 'knuffelboek_bron';
const GELDIG_MS = 30 * 24 * 3600 * 1000; // 30 dagen, gelijk aan de app

/** Lees de bron uit de link. Geen van de velden aanwezig: null. */
export function bronUitLink(search: string): Bron | null {
  const p = new URLSearchParams(search);
  const bron: Bron = {};
  for (const veld of VELDEN) {
    const waarde = p.get(veld);
    if (waarde) bron[veld] = waarde.slice(0, 80);
  }
  return Object.keys(bron).length ? bron : null;
}

/**
 * Welke bron bewaren we? Een nieuwe link met een utm vervangt de oude bron.
 * Een link met alleen een thema (bijv. de link in de bio) vult de oude bron aan.
 */
export function nieuweBron(oud: Bron | null, uitLink: Bron | null): Bron | null {
  if (!uitLink) return oud;
  if (uitLink.utm_source || uitLink.utm_campaign) return uitLink;
  return { ...(oud || {}), ...uitLink };
}

/**
 * Zet de bron op een link naar de app. Andere links blijven zoals ze zijn.
 * Heeft de bron zelf geen utm_content, dan blijft de plek van de knop staan.
 */
export function linkMetBron(href: string, bron: Bron | null): string {
  if (!bron || !href.startsWith(WEBAPP_URL)) return href;
  try {
    const url = new URL(href);
    for (const veld of VELDEN) {
      const waarde = bron[veld];
      if (waarde) url.searchParams.set(veld, waarde);
    }
    return url.toString();
  } catch {
    return href;
  }
}

/** De bewaarde bron, of null als die er niet is of ouder is dan 30 dagen. */
export function leesBron(): Bron | null {
  try {
    const bewaard = JSON.parse(window.localStorage.getItem(SLEUTEL) || 'null');
    if (!bewaard || Date.now() - (bewaard.at || 0) > GELDIG_MS) return null;
    return bewaard.bron || null;
  } catch {
    return null;
  }
}

/** Bewaar de bron uit de huidige link (als die er is). */
export function bewaarBron(search: string): void {
  try {
    const uitLink = bronUitLink(search);
    if (!uitLink) return;
    const bron = nieuweBron(leesBron(), uitLink);
    window.localStorage.setItem(SLEUTEL, JSON.stringify({ bron, at: Date.now() }));
  } catch {
    // Zonder opslag geen bron: de site werkt gewoon door.
  }
}
