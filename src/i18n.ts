import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ru from './locales/ru/translation.json';
import uk from './locales/uk/translation.json';
import kk from './locales/kk/translation.json';
import en from './locales/en/translation.json';

// Language is set automatically by GeoProvider (IP + browser language).
// No LanguageDetector — no manual switching.
i18n
  .use(initReactI18next)
  .init({
    resources: {
      ru: { translation: ru },
      uk: { translation: uk },
      kk: { translation: kk },
      en: { translation: en },
    },
    lng: 'en',        // initial placeholder; GeoProvider overrides immediately
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    supportedLngs: ['ru', 'uk', 'kk', 'en'],
  });

export default i18n;
