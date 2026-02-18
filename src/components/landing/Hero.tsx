import { motion } from 'framer-motion';
import { useContent } from '../../context/ContentContext';
import { useTranslation } from 'react-i18next';
import { CountdownTimer } from '../shared/CountdownTimer';
import { Button } from '../shared/Button';

export function Hero() {
  const { content } = useContent();
  const { t } = useTranslation();
  const { hero } = content;

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center pt-20 pb-12 overflow-hidden bg-surface"
    >
      <div className="relative z-10 w-full max-w-3xl mx-auto px-2 sm:px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Meta bar */}
          <div className="flex items-center gap-3 text-sm text-text-secondary mb-8">
            <span className="font-medium">18.02</span>
            <span className="text-text-muted">|</span>
            <span className="font-medium">19:00</span>
            <span className="text-text-muted">|</span>
            <span className="font-medium">online</span>
          </div>

          <h1 className="flex flex-col items-start font-bold leading-none mb-6 zigzag-lines">
            {hero.title.split('\n').map((line, i) => (
              i === 0 ? (
                <span key={i} className="text-4xl md:text-6xl lg:text-7xl mb-3 block text-text-primary">
                  {line}
                </span>
              ) : (
                <span key={i} className="tape text-2xl md:text-3xl lg:text-4xl mb-2 block">
                  {line}
                </span>
              )
            ))}
          </h1>

          <p className="text-base md:text-lg text-text-secondary max-w-2xl mb-8 whitespace-pre-line font-normal leading-relaxed">
            {hero.subtitle}
          </p>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-10">
            <Button
              variant="primary"
              size="lg"
              className="text-lg md:text-xl px-10 py-5 uppercase tracking-wide"
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {hero.ctaText}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg md:text-xl px-10 py-5"
              onClick={() => document.getElementById('program')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {hero.secondaryCtaText}
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col items-center gap-3"
        >
          <p className="text-sm text-text-muted">{t('ui.countdownLabel')}</p>
          <CountdownTimer targetDate={hero.countdownDate} />
        </motion.div>
      </div>
    </section>
  );
}
