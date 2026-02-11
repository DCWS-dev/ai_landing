import { motion } from 'framer-motion';
import { Sparkles, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useContent } from '../../context/ContentContext';
import { Button } from '../shared/Button';
import { CountdownTimer } from '../shared/CountdownTimer';

export function Hero() {
  const { content } = useContent();
  const { hero } = content;
  const [showArrow, setShowArrow] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowArrow(false);
      } else {
        setShowArrow(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center px-4 pt-20 pb-12 overflow-hidden gradient-bg stars-bg"
    >
      {/* Decorative orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-neon/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 rounded-full px-4 py-2 mb-6">
            <Sparkles size={16} className="text-accent" />
            <span className="text-sm text-accent">7-дневный марафон</span>
          </div>

          <h1 className="flex flex-col items-center font-extrabold leading-tight mb-6">
            {hero.title.split('\n').map((line, i) => (
              i === 0 ? (
                <span key={i} className="text-4xl md:text-6xl lg:text-7xl mb-4 block">
                  {line.split(/(ИИ)/g).map((part, index) =>
                    part === 'ИИ' ? <span key={index} className="text-neon-green">ИИ</span> : part
                  )}
                </span>
              ) : (
                <span key={i} className="text-2xl md:text-4xl lg:text-5xl gradient-text block leading-snug">
                  {line}
                </span>
              )
            ))}
          </h1>

          <p className="text-base md:text-lg text-text-secondary max-w-2xl mx-auto mb-8 whitespace-pre-line">
            {hero.subtitle}
          </p>
        </motion.div>

        <motion.ul
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="space-y-3 mb-8 text-center max-w-md mx-auto flex flex-col items-center"
        >
          {hero.bullets.map((bullet, i) => (
            <li key={i} className="flex flex-col items-center gap-1">
              <span className="text-accent text-xl">✦</span>
              <span className="text-text-secondary">{bullet}</span>
            </li>
          ))}
        </motion.ul>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col items-center gap-4 mb-10"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {hero.ctaText}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => document.getElementById('program')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {hero.secondaryCtaText}
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-col items-center gap-3"
        >
          <p className="text-sm text-text-muted">До старта осталось:</p>
          <CountdownTimer targetDate={hero.countdownDate} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showArrow ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className="absolute -bottom-4 left-1/2 -translate-x-1/2"
        >
          <ChevronDown size={28} className="text-text-muted animate-bounce" />
        </motion.div>
      </div>
    </section>
  );
}
