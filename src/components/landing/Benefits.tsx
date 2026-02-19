import { X } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { useTranslation } from 'react-i18next';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export function Benefits() {
  const { content } = useContent();
  const { t } = useTranslation();
  const { benefits } = content;
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const negativeItems = benefits.scenarios.slice(0, 3);
  const positiveItem = benefits.scenarios[3] || '';

  return (
    <motion.section
      id="benefits"
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="py-16 md:py-24 px-2 sm:px-4 md:px-8 bg-[#1e1e1e] relative overflow-hidden"
    >
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-16 right-8 w-80 h-80 bg-rose-500/8 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-20 left-8 w-72 h-72 bg-emerald-500/6 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <h2 className="text-3xl md:text-5xl font-semibold text-center mb-16 leading-tight">
          <span className="text-white block mb-2">{t('ui.benefitsTitle1')}</span>
          <span className="text-primary block">{t('ui.benefitsTitle2')}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left: negative scenarios */}
          <div className="space-y-4">
            {negativeItems.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-5 rounded-2xl bg-[#ffe4e4] border border-rose-300/40"
              >
                <X className="shrink-0 mt-0.5 text-rose-500" size={20} />
                <p className="text-[#555] text-base leading-relaxed">{item}</p>
              </div>
            ))}
          </div>

          {/* Right: positive alternative */}
          <div className="relative">
            <div className="p-8 rounded-2xl bg-[#e8fcf0]/12 border border-emerald-500/25 text-center">
              <h3 className="text-2xl font-bold text-emerald-600 mb-4 uppercase">{t('ui.benefitsOr')}</h3>
              <p className="text-xl text-emerald-400/50 leading-relaxed">
                {positiveItem.replace(/^(ИЛИ|АБО)\s*/i, '')}
              </p>
              <div className="mt-8 pt-6 border-t border-emerald-500/20 text-base text-emerald-500">
                {t('ui.benefitsPlus1')}<br />
                {t('ui.benefitsPlus2')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}