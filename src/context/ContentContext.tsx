import { createContext, useContext, useCallback, useState, useEffect, type ReactNode } from 'react';
import type { SiteContent } from '../types/content';
import { useTranslation } from 'react-i18next';
import { defaultContent } from '../data/defaultContent';

interface ContentContextValue {
  content: SiteContent;
  updateContent: <K extends keyof SiteContent>(section: K, data: SiteContent[K]) => void;
  resetContent: () => void;
}

const ContentContext = createContext<ContentContextValue | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  const [content, setContent] = useState<SiteContent>(defaultContent);

  const lang = i18n.resolvedLanguage || 'ru';

  useEffect(() => {
    const loadContent = () => {
      // 1. Получаем базовый контент из i18n (из JSON файлов)
      const i18nData = i18n.getResourceBundle(lang, 'translation');
      const baseContent = (i18nData ? i18nData : defaultContent) as unknown as SiteContent;

      // 2. Проверяем локальные переопределения
      const storageKey = `site_content_${lang}`;
      const stored = localStorage.getItem(storageKey);
      
      let finalContent = baseContent;

      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          finalContent = { ...baseContent, ...parsed };
          
          // Обновляем i18n ресурсы, чтобы компоненты с useTranslation получили изменения
          i18n.addResourceBundle(lang, 'translation', parsed, true, true);
        } catch (e) {
          console.error("Failed to parse stored content", e);
        }
      } else {
        // Если нет сохраненного, убедимся что отображается то что в файлах
        // (на случай если смена языка происходит без перезагрузки)
        // Хотя i18n сам справится, но нам нужно обновить state 'content'
      }
      
      setContent(finalContent);
    };

    loadContent();
    
    // Подписываемся на события загрузки языка, на случай асинхронной подгрузки
    i18n.on('loaded', loadContent);
    i18n.on('languageChanged', loadContent);
    
    return () => {
      i18n.off('loaded', loadContent);
      i18n.off('languageChanged', loadContent);
    };
  }, [lang, i18n]);

  const updateContent = useCallback(<K extends keyof SiteContent>(section: K, data: SiteContent[K]) => {
     setContent(prev => {
        const newContent = { ...prev, [section]: data };
        
        // Сохраняем в localStorage
        const storageKey = `site_content_${lang}`;
        localStorage.setItem(storageKey, JSON.stringify(newContent));
        
        // Обновляем i18n
        i18n.addResourceBundle(lang, 'translation', { [section]: data }, true, true);
        
        return newContent;
     });
  }, [lang, i18n]);

  const resetContent = useCallback(() => {
    if (window.confirm('Вы уверены? Страница будет перезагружена.')) {
        const storageKey = `site_content_${lang}`;
        localStorage.removeItem(storageKey);
        window.location.reload();
    }
  }, [lang]);

  return (
    <ContentContext.Provider value={{ content, updateContent, resetContent }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used within ContentProvider');
  return ctx;
}
