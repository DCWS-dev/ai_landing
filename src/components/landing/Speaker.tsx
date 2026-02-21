import { useContent } from '../../context/ContentContext';
import { useTranslation } from 'react-i18next';
import { SectionWrapper } from '../shared/SectionWrapper';

export function Speaker() {
  const { content } = useContent();
  const { t } = useTranslation();
  const { speaker } = content;

  return (
    <SectionWrapper id="speaker" className="bg-surface relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-16 right-1/4 w-80 h-80 bg-primary/6 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-16 left-8 w-72 h-72 bg-primary/4 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Books decorations — scattered chaotically */}
      <img
        src="/books.png"
        alt=""
        className="hidden md:block absolute left-2 top-[15%] w-20 lg:w-28 opacity-35 drop-shadow-lg animate-float pointer-events-none z-0 -rotate-12"
      />
      <img
        src="/books.png"
        alt=""
        className="hidden md:block absolute right-4 top-[10%] w-16 lg:w-24 opacity-30 drop-shadow-lg animate-float animation-delay-2000 pointer-events-none z-0 rotate-6"
      />
      <img
        src="/books.png"
        alt=""
        className="hidden md:block absolute left-[8%] bottom-[12%] w-14 lg:w-20 opacity-25 drop-shadow-lg animate-float animation-delay-4000 pointer-events-none z-0 rotate-[20deg]"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h2 className="text-3xl md:text-5xl font-semibold text-left md:text-center mb-16">
          {t('ui.speakerTitle')}
        </h2>

        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-16">
          {/* Avatar placeholder */}
          <div className="shrink-0 relative">
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full bg-surface-light p-1 border border-contrast/10">
              <div className="w-full h-full rounded-full bg-surface-light overflow-hidden relative flex items-center justify-center">
                <img
                  src={speaker.photoUrl || '/ava_1.png'}
                  alt={speaker.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

        <div className="text-center md:text-left">
          <h3 className="text-2xl md:text-3xl font-bold mb-1">{speaker.name}</h3>
          <p className="text-primary mb-4">{speaker.role}</p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {speaker.facts.map((fact, i) => (
              <div key={i} className="card-clean rounded-xl p-3 text-sm text-text-secondary">
                ⚡ {fact}
              </div>
            ))}
          </div>

          <p className="text-text-secondary leading-relaxed">{speaker.bio}</p>
        </div>
      </div>
      </div>
    </SectionWrapper>
  );
}
