import { useState } from 'react';
import { ChevronDown, Play, BookOpen, Wrench, Trophy } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { SectionWrapper } from '../shared/SectionWrapper';
import { Button } from '../shared/Button';

export function Program() {
  const { content } = useContent();
  const { program } = content;
  const [openDay, setOpenDay] = useState<number | null>(null);

  return (
    <SectionWrapper id="program" className="gradient-bg">
      <h2 className="text-2xl md:text-4xl font-bold text-center mb-12">
        {program.title}
      </h2>

      <div className="max-w-3xl mx-auto space-y-3">
        {program.days.map((day) => {
          const isOpen = openDay === day.day;
          return (
            <div
              key={day.day}
              className="card-glass rounded-xl overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenDay(isOpen ? null : day.day)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/30 flex items-center justify-center font-bold text-accent">
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
                <div className="px-5 pb-5 space-y-3 border-t border-white/5 pt-4">
                  <div className="flex items-start gap-3">
                    <Trophy size={16} className="text-accent shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs text-text-muted">Результат:</span>
                      <p className="text-sm text-text-secondary">{day.result}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Wrench size={16} className="text-neon shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs text-text-muted">Инструменты:</span>
                      <p className="text-sm text-text-secondary">{day.tool}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    {day.format.includes('Трансляция') ? (
                      <Play size={16} className="text-primary-light shrink-0 mt-0.5" />
                    ) : (
                      <BookOpen size={16} className="text-primary-light shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="text-xs text-text-muted">Формат:</span>
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
