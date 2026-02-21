import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  detectGeo,
  getLocaleFromBrowserLang,
  getCurrencyForLocale,
  type GeoLocale,
  type GeoCurrency,
} from '../services/geo';

interface GeoContextValue {
  country: string;
  locale: GeoLocale;
  currency: GeoCurrency;
  ready: boolean;
}

const browserLocale = getLocaleFromBrowserLang();

const GeoContext = createContext<GeoContextValue>({
  country: '',
  locale: browserLocale,
  currency: getCurrencyForLocale(browserLocale),
  ready: false,
});

export function GeoProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  const [geo, setGeo] = useState<GeoContextValue>({
    country: '',
    locale: browserLocale,
    currency: getCurrencyForLocale(browserLocale),
    ready: false,
  });

  useEffect(() => {
    // 1. Instant: set language from browser hint
    i18n.changeLanguage(browserLocale);

    // 2. Async: refine with IP geolocation
    detectGeo().then((info) => {
      setGeo({ ...info, ready: true });
      if (info.locale !== i18n.language) {
        i18n.changeLanguage(info.locale);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <GeoContext.Provider value={geo}>{children}</GeoContext.Provider>;
}

export function useGeo() {
  return useContext(GeoContext);
}
