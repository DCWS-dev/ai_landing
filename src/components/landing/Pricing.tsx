import { Check, Gift } from 'lucide-react';
// import { Shield } from 'lucide-react'; // TEMPORARILY DISABLED (payments off)
import { useContent } from '../../context/ContentContext';
import { useTranslation } from 'react-i18next';
import { SectionWrapper } from '../shared/SectionWrapper';
// import { LeadForm } from '../shared/LeadForm'; // TEMPORARILY DISABLED (payments off)
import { CountdownTimer } from '../shared/CountdownTimer';
import { defaultContent } from '../../data/defaultContent';

export function Pricing() {
  const { content } = useContent();
  const { t } = useTranslation();
  const { pricing } = content;
  // const [paid, setPaid] = useState(false); // TEMPORARILY DISABLED (payments off)

  // Price comes from the active locale's translation file (already currency-correct)
  const priceDisplay = pricing.price;
  const oldPriceDisplay = pricing.oldPrice;
  const timerDate = pricing.countdownDate || defaultContent.pricing.countdownDate;

  return (
    <SectionWrapper id="pricing" className="bg-surface relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-16 right-8 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-16 left-8 w-64 h-64 bg-primary/4 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Moneyhand decoration */}
      <img
        src="/moneyhand.png"
        alt=""
        className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-40 lg:w-52 opacity-50 drop-shadow-lg animate-float pointer-events-none z-0"
      />

      {/* Dollars decoration */}
      <img
        src="/dollars.png"
        alt=""
        className="hidden md:block absolute right-0 top-1/3 w-32 lg:w-44 opacity-40 drop-shadow-lg animate-float animation-delay-2000 pointer-events-none z-0"
      />

      <h2 className="text-2xl md:text-4xl font-semibold text-left md:text-center mb-12 relative z-10">
        {pricing.title}
      </h2>

      <div className="max-w-lg mx-auto">
        <div className="card-clean rounded-3xl p-8 md:p-10 border-primary/20 border relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />

          {/* Currency Toggle — TEMPORARILY DISABLED (payments off) */}
          {/* <div className="flex justify-center mb-6">
            <div className="bg-surface-light p-1 rounded-full border border-contrast/10 flex">
              <button
                onClick={() => setCurrency('RUB')}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all cursor-pointer ${
                  currency === 'RUB' ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                RUB 🇷🇺
              </button>
              <button
                onClick={() => setCurrency('UAH')}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all cursor-pointer ${
                  currency === 'UAH' ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                UAH 🇺🇦
              </button>
            </div>
          </div> */}

          <div className="text-center mb-8 relative">
            <p className="text-xl md:text-2xl text-text-muted line-through mb-1">{oldPriceDisplay}</p>
            <p className="text-5xl md:text-6xl font-extrabold text-text-primary mb-2">{priceDisplay}</p>
            <p className="text-text-muted mb-4">{t('ui.fullAccess')}</p>
            {timerDate && (
              <div className="mt-2">
                <p className="text-sm font-semibold text-primary mb-2">{t('ui.discountUntil')}</p>
                <div className="flex justify-center">
                  <CountdownTimer targetDate={timerDate} />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3 mb-8">
            {pricing.features.map((feature, i) => (
              <div key={i} className="flex items-start gap-3">
                <Check size={18} className="text-green-500 shrink-0 mt-0.5" />
                <p className="text-text-secondary text-sm">{feature}</p>
              </div>
            ))}
          </div>

          {pricing.bonuses.length > 0 && (
            <div className="mb-8 p-4 rounded-xl bg-primary/5 border border-primary/10">
              <div className="flex items-center gap-2 mb-3">
                <Gift size={18} className="text-primary" />
                <p className="font-semibold text-primary text-sm">{t('ui.bonuses')}</p>
              </div>
              <ul className="space-y-2">
                {pricing.bonuses.map((bonus, i) => (
                  <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                    <span className="text-primary">🎁</span>
                    {bonus}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Payment form — TEMPORARILY DISABLED */}
          {/* <div className="border-t border-contrast/10 pt-6">
            <LeadForm onSuccess={() => setPaid(true)} currency={currency} />
          </div> */}

          {/* <div className="flex items-center justify-center gap-2 mt-4">
            <Shield size={14} className="text-text-muted" />
            <p className="text-xs text-text-muted">{t('ui.safePayment')}</p>
          </div> */}
        </div>
      </div>
    </SectionWrapper>
  );
}
