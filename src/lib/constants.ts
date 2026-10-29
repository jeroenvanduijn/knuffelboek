// Webapp URL voor het maken van boeken
export const WEBAPP_URL = process.env.NEXT_PUBLIC_WEBAPP_URL || 'https://app.knuffelboek.nl';

/**
 * Link naar de app met UTM-parameters, zodat we zien welke knop werkt.
 * `content` = de plek van de knop (bijv. 'hero', 'header', 'prijzen-hardcover').
 */
export function appUrl(content: string, campaign = 'home'): string {
  const params = new URLSearchParams({
    utm_source: 'website',
    utm_medium: 'cta',
    utm_campaign: campaign,
    utm_content: content,
  });
  return `${WEBAPP_URL}/?${params.toString()}`;
}

// Beelden staan in Vercel Blob
export const IMAGE_BASE = 'https://smt0i9fnjglr6owb.public.blob.vercel-storage.com/pictures';

// Logo (schaapje), 500x500 png met transparante achtergrond
export const LOGO_URL = 'https://smt0i9fnjglr6owb.public.blob.vercel-storage.com/pictures/logo/Ontwerp%20zonder%20titel%20%2850%29.png';

export const CONTACT_EMAIL = 'info@knuffelboek.nl';

// Levertijd: voorzichtige schatting tot de echte Lulu-levertijd van de testbestelling bekend is.
export const LEVERTIJD = '2 tot 3 weken';
