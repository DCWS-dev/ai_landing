import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { useTranslation } from 'react-i18next';
import { SectionWrapper } from '../shared/SectionWrapper';

export function FAQ() {
  const { content } = useContent();
  const { t } = useTranslation();
  const { faq } = content;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <SectionWrapper id="faq">
      <h2 className="text-2xl md:text-4xl font-bold text-center mb-12">
        {faq.title}
      </h2>

      <div className="max-w-3xl mx-auto space-y-3">
        {faq.items.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={i} className="card-glass rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors cursor-pointer"
              >
                <p className="font-semibold pr-4">{item.question}</p>
                <ChevronDown
                  size={20}
                  className={`text-text-muted shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 border-t border-white/5 pt-4">
                  {i === faq.items.length - 1 && (item.answer.includes('Политика') || item.answer.includes('Політика')) ? (
                    <p className="text-text-secondary text-sm leading-relaxed">
                      <a 
                        href={content.footer.privacyUrl}
                        className="text-accent hover:underline"
                      >
                        {t('privacyPolicy.title')}
                      </a>
                      <span className="text-text-secondary">, </span>
                      <a 
                        href={content.footer.termsUrl}
                        className="text-accent hover:underline"
                      >
                        {t('termsOfService.title')}
                      </a>
                    </p>
                  ) : (
                    <p className="text-text-secondary text-sm leading-relaxed">{item.answer}</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
