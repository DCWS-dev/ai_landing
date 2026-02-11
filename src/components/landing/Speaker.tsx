import { useContent } from '../../context/ContentContext';
import { SectionWrapper } from '../shared/SectionWrapper';

export function Speaker() {
  const { content } = useContent();
  const { speaker } = content;

  return (
    <SectionWrapper id="speaker" className="gradient-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 gradient-text">
          Твой учитель
        </h2>

        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-16">
          {/* Avatar placeholder */}
          <div className="shrink-0 relative">
            <div className="absolute inset-0 bg-primary/30 blur-3xl rounded-full" />
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-primary to-neon-purple p-1 glow-purple">
              <div className="w-full h-full rounded-full bg-surface-light overflow-hidden relative flex items-center justify-center">
                {speaker.photoUrl ? (
                  <img
                    src={speaker.photoUrl}
                    alt={speaker.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-8xl">👩‍💻</span>
                )}
              </div>
            </div>
          </div>

        <div className="text-center md:text-left">
          <h3 className="text-2xl md:text-3xl font-bold mb-1">{speaker.name}</h3>
          <p className="text-accent mb-4">{speaker.role}</p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {speaker.facts.map((fact, i) => (
              <div key={i} className="card-glass rounded-lg p-3 text-sm text-text-secondary">
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
