import { useState } from 'react';
import { Check, Gift, Shield } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { SectionWrapper } from '../shared/SectionWrapper';
import { Button } from '../shared/Button';
import { Modal } from '../shared/Modal';
import { LeadForm } from '../shared/LeadForm';

export function Pricing() {
  const { content } = useContent();
  const { pricing } = content;
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currency, setCurrency] = useState<'RUB' | 'UAH'>('RUB');

  const priceDisplay = currency === 'RUB' ? '1 990 ₽' : '890 ₴';

  return (
    <SectionWrapper id="pricing" className="gradient-bg">
      <h2 className="text-2xl md:text-4xl font-bold text-center mb-12">
        {pricing.title}
      </h2>

      <div className="max-w-lg mx-auto">
        <div className="card-glass rounded-3xl p-8 md:p-10 border-accent/30 border relative overflow-hidden">
          {/* Glow effect */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent/10 rounded-full blur-3xl" />

          {/* Currency Toggle */}
          <div className="flex justify-center mb-6">
            <div className="bg-surface-light p-1 rounded-xl border border-white/10 flex">
              <button
                onClick={() => setCurrency('RUB')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  currency === 'RUB' ? 'bg-primary text-white shadow-lg' : 'text-text-secondary hover:text-white'
                }`}
              >
                RUB 🇷🇺
              </button>
              <button
                onClick={() => setCurrency('UAH')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  currency === 'UAH' ? 'bg-primary text-white shadow-lg' : 'text-text-secondary hover:text-white'
                }`}
              >
                UAH 🇺🇦
              </button>
            </div>
          </div>

          <div className="text-center mb-8 relative">
            <p className="text-5xl md:text-6xl font-extrabold gradient-text mb-2">{priceDisplay}</p>
            <p className="text-text-muted">за полный 7-дневный доступ</p>
          </div>

          <div className="space-y-3 mb-8">
            {pricing.features.map((feature, i) => (
              <div key={i} className="flex items-start gap-3">
                <Check size={18} className="text-neon shrink-0 mt-0.5" />
                <p className="text-text-secondary text-sm">{feature}</p>
              </div>
            ))}
          </div>

          {pricing.bonuses.length > 0 && (
            <div className="mb-8 p-4 rounded-xl bg-accent/10 border border-accent/20">
              <div className="flex items-center gap-2 mb-3">
                <Gift size={18} className="text-accent" />
                <p className="font-semibold text-accent text-sm">Бонусы:</p>
              </div>
              <ul className="space-y-2">
                {pricing.bonuses.map((bonus, i) => (
                  <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                    <span className="text-accent">🎁</span>
                    {bonus}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Button
            variant="primary"
            size="lg"
            className="w-full animate-pulse-glow"
            onClick={() => setShowPaymentModal(true)}
          >
            {pricing.ctaText}
          </Button>

          <div className="flex items-center justify-center gap-2 mt-4">
            <Shield size={14} className="text-text-muted" />
            <p className="text-xs text-text-muted">Безопасная оплата • Гарантия возврата 2 дня</p>
          </div>
        </div>
      </div>

      <Modal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} title="Запись на марафон">
        <LeadForm onSuccess={() => setShowPaymentModal(false)} currency={currency} />
      </Modal>
    </SectionWrapper>
  );
}
