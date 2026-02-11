import { useContent } from '../../context/ContentContext';
import { SectionWrapper } from '../shared/SectionWrapper';

export function Audience() {
  const { content } = useContent();
  const { audience } = content;

  return (
    <SectionWrapper id="audience" className="gradient-bg">
      <h2 className="text-2xl md:text-4xl font-bold text-center mb-12">
        {audience.title}
      </h2>

      <div className="grid sm:grid-cols-2 gap-6">
        {audience.cards.map((card, i) => (
          <div
            key={i}
            className="card-glass rounded-2xl p-6 md:p-8 hover:border-primary-light/40 transition-all group"
          >
            <div className="text-4xl mb-4">{card.icon}</div>
            <h3 className="text-xl font-bold mb-4 group-hover:text-accent transition-colors">
              {card.role}
            </h3>

            <div className="mb-4">
              <p className="text-xs uppercase tracking-wider text-text-muted mb-2">Боли:</p>
              <ul className="space-y-1">
                {card.pains.map((pain, j) => (
                  <li key={j} className="text-sm text-red-400 flex items-start gap-2">
                    <span className="mt-0.5">✕</span>
                    {pain}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-text-muted mb-2">Результат:</p>
              <ul className="space-y-1">
                {card.results.map((result, j) => (
                  <li key={j} className="text-sm text-neon-green flex items-start gap-2">
                    <span className="mt-0.5">✓</span>
                    {result}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
