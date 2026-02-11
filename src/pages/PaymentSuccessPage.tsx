import { useSearchParams } from 'react-router-dom';
import { CheckCircle, Send, ArrowLeft } from 'lucide-react';

const TELEGRAM_BOT_USERNAME = import.meta.env.VITE_TELEGRAM_BOT_USERNAME || 'your_bot';

export function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id') || '';

  const botLink = `https://t.me/${TELEGRAM_BOT_USERNAME}?start=${orderId}`;

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="card-glass rounded-2xl p-8 max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-6">
          <CheckCircle size={36} className="text-green-400" />
        </div>

        <h1 className="text-2xl font-bold mb-2">Оплата прошла успешно!</h1>
        <p className="text-text-secondary mb-6">
          Спасибо за покупку! Для получения доступа к марафону перейдите в наш Telegram-бот и подтвердите участие.
        </p>

        <a
          href={botLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[#2AABEE] text-white font-bold hover:bg-[#229ED9] transition-colors text-lg"
        >
          <Send size={20} />
          Перейти в Telegram-бот
        </a>

        <p className="text-xs text-text-muted mt-4">
          Бот автоматически проверит вашу оплату и откроет доступ к материалам марафона.
        </p>

        <a
          href="/"
          className="inline-flex items-center gap-1.5 mt-6 text-sm text-text-muted hover:text-accent transition-colors"
        >
          <ArrowLeft size={14} />
          Вернуться на главную
        </a>
      </div>
    </div>
  );
}
