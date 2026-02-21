export type GeoLocale = 'ru' | 'uk' | 'kk' | 'en';
export type GeoCurrency = 'RUB' | 'UAH' | 'KZT' | 'USD';

export interface GeoInfo {
  country: string;
  locale: GeoLocale;
  currency: GeoCurrency;
}

const COUNTRY_TO_CONFIG: Record<string, { locale: GeoLocale; currency: GeoCurrency }> = {
  RU: { locale: 'ru', currency: 'RUB' },
  UA: { locale: 'uk', currency: 'UAH' },
  KZ: { locale: 'kk', currency: 'KZT' },
};

const DEFAULT_CONFIG: { locale: GeoLocale; currency: GeoCurrency } = {
  locale: 'en',
  currency: 'USD',
};

/** Synchronous best-guess from browser language (used before IP result arrives) */
export function getLocaleFromBrowserLang(): GeoLocale {
  const lang = (navigator.language || '').toLowerCase();
  const primary = lang.split('-')[0];
  if (primary === 'ru') return 'ru';
  if (primary === 'uk') return 'uk';
  if (primary === 'kk') return 'kk';
  return 'en';
}

export function getCurrencyForLocale(locale: GeoLocale): GeoCurrency {
  switch (locale) {
    case 'ru': return 'RUB';
    case 'uk': return 'UAH';
    case 'kk': return 'KZT';
    default:   return 'USD';
  }
}

let cachedGeo: GeoInfo | null = null;

/**
 * Detect user country via free IP-geolocation API.
 * Falls back to browser language if the request fails or times out (3 s).
 */
export async function detectGeo(): Promise<GeoInfo> {
  if (cachedGeo) return cachedGeo;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const res = await fetch('https://api.country.is/', { signal: controller.signal });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const country = (data.country || '').toUpperCase();
      const config = COUNTRY_TO_CONFIG[country] || DEFAULT_CONFIG;
      cachedGeo = { country, ...config };
      return cachedGeo;
    }
  } catch {
    // network / timeout — fall through to browser-language heuristic
  }

  const locale = getLocaleFromBrowserLang();
  cachedGeo = { country: '', locale, currency: getCurrencyForLocale(locale) };
  return cachedGeo;
}
