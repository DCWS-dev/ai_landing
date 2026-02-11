import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Button } from './Button';

interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  telegram: string;
}

interface LeadFormProps {
  onSuccess?: () => void;
  currency?: 'RUB' | 'UAH';
}

export function LeadForm({ onSuccess, currency = 'RUB' }: LeadFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadFormData>();

  const isUAH = currency === 'UAH';
  const phonePlaceholder = isUAH ? '+380 (XX) XXX-XX-XX' : '+7 (900) 123-45-67';

  const onSubmit = async (data: LeadFormData) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, currency }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Ошибка создания платежа');
      }

      const responseData = await res.json();
      
      onSuccess?.();

      if (responseData.paymentSystem === 'wayforpay') {
        // Handle WayForPay: Create and submit invisible form
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = responseData.url;
        form.target = '_self'; // or _blank

        for (const [key, value] of Object.entries(responseData.data)) {
          if (Array.isArray(value)) {
             value.forEach(v => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key + '[]'; // WayForPay array convention
                input.value = String(v);
                form.appendChild(input);
             });
          } else {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = String(value);
            form.appendChild(input);
          }
        }
        
        document.body.appendChild(form);
        form.submit();
        
      } else {
        // Default to Prodamus logic (URL redirect)
         window.location.href = responseData.paymentUrl;
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      if (typeof window !== 'undefined' && !document.querySelector('form[action*="wayforpay"]')) {
          setLoading(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <p className="text-text-secondary text-sm mb-4">
        Заполните форму для записи на марафон. После оплаты вы получите доступ ко всем материалам.
      </p>

      <div>
        <label className="block text-sm text-text-secondary mb-1">Ваше имя</label>
        <input
          {...register('name', { required: 'Введите имя' })}
          type="text"
          placeholder="Александр"
          className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 text-white placeholder-text-muted focus:border-primary focus:outline-none transition-colors"
        />
        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm text-text-secondary mb-1">Email</label>
        <input
          {...register('email', {
            required: 'Введите email',
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Некорректный email' },
          })}
          type="email"
          placeholder="you@email.com"
          className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 text-white placeholder-text-muted focus:border-primary focus:outline-none transition-colors"
        />
        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm text-text-secondary mb-1">
          {isUAH ? 'Телефон (UA)' : 'Телефон (RU)'}
        </label>
        <input
          {...register('phone', {
            required: 'Введите телефон',
            validate: (value) => {
               const digits = value.replace(/\D/g, '');
               if (isUAH) {
                 // UA: 380XXXXXXXXX (12 digits) or 0XXXXXXXXX (10 digits)
                 return (digits.length === 12 && digits.startsWith('380')) || (digits.length === 10 && digits.startsWith('0')) || 'Введите корректный номер (напр. +380... або 0...)';
               } else {
                 // RU: 79XXXXXXXXX (11 digits) or 89XXXXXXXXX (11 digits)
                 return (digits.length === 11 && (digits.startsWith('7') || digits.startsWith('8'))) || 'Введите корректный номер (напр. +7...)';
               }
            }
          })}
          type="tel"
          placeholder={phonePlaceholder}
          className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 text-white placeholder-text-muted focus:border-primary focus:outline-none transition-colors"
        />
        {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
      </div>

      <div>
        <label className="block text-sm text-text-secondary mb-1">Telegram username</label>
        <input
          {...register('telegram')}
          type="text"
          placeholder="@username"
          className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 text-white placeholder-text-muted focus:border-primary focus:outline-none transition-colors"
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-400 bg-red-400/10 rounded-lg p-3">
          <AlertTriangle size={16} />
          {error}
        </div>
      )}

      <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Перенаправление на оплату...
          </>
        ) : (
          'Оплатить 1 990 ₽'
        )}
      </Button>

      <p className="text-xs text-text-muted text-center">
        Нажимая кнопку, вы соглашаетесь с{' '}{t('privacyPolicy.title').toLowerCase()}
        <a href="/privacy" className="underline hover:text-text-secondary">политикой конфиденциальности</a>
      </p>
    </form>
  );
}
