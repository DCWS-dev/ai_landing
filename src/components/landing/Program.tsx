import { useState } from 'react';
import { ChevronDown, Play, BookOpen, Wrench, Trophy } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { useTranslation } from 'react-i18next';
import { SectionWrapper } from '../shared/SectionWrapper';
import { Button } from '../shared/Button';

export function Program() {
  const { content } = useContent();
  const { t } = useTranslation();
  const { program } = content;
  const [openDay, setOpenDay] = useState<number | null>(null);

  return (
    <SectionWrapper id="program" className="bg-surface relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-8 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-blob animation-delay-4000" />
        <div className="absolute bottom-16 right-1/4 w-80 h-80 bg-primary/4 rounded-full blur-3xl animate-blob" />
      </div>

      {/* Calendar decoration */}
      <img
        src="/calendar.png"
        alt=""
        className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-32 lg:w-44 opacity-45 drop-shadow-lg animate-float animation-delay-4000 pointer-events-none z-0"
      />

      <h2 className="text-2xl md:text-4xl font-semibold text-left md:text-center mb-12 relative z-10">
        {program.title}
      </h2>

      <div className="max-w-3xl mx-auto space-y-3">
        {program.days.map((day) => {
          const isOpen = openDay === day.day;
          return (
            <div
              key={day.day}
              className="card-clean rounded-xl overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenDay(isOpen ? null : day.day)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-contrast/5 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary font-sans">
                    {day.day}
                  </div>
                  <div>
                    <p className="font-semibold">{day.title}</p>
                  </div>
                </div>
                <ChevronDown
                  size={20}
                  className={`text-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 space-y-3 border-t border-contrast/5 pt-4">
                  <div className="flex items-start gap-3">
                    <Trophy size={16} className="text-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs text-text-muted">{t('ui.programResult')}</span>
                      <p className="text-sm text-text-secondary">{day.result}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Wrench size={16} className="text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs text-text-muted">{t('ui.programTools')}</span>
                      <p className="text-sm text-text-secondary">{day.tool}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    {/трансляц|stream|live/i.test(day.format) ? (
                      <Play size={16} className="text-primary-light shrink-0 mt-0.5" />
                    ) : (
                      <BookOpen size={16} className="text-primary-light shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="text-xs text-text-muted">{t('ui.programFormat')}</span>
                      <p className="text-sm text-text-secondary">{day.format}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="text-center mt-10">
        <Button
          variant="primary"
          size="lg"
          onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
        >
          {program.ctaText}
        </Button>
      </div>
    </SectionWrapper>
  );
}
