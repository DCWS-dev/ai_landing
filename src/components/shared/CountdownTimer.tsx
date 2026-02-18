import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface CountdownTimerProps {
  targetDate: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(targetDate: string): TimeLeft {
  const diff = new Date(targetDate).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(targetDate));
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const blocks = [
    { value: timeLeft.days, label: t('ui.timerDays') },
    { value: timeLeft.hours, label: t('ui.timerHours') },
    { value: timeLeft.minutes, label: t('ui.timerMinutes') },
    { value: timeLeft.seconds, label: t('ui.timerSeconds') },
  ];

  return (
    <div className="flex gap-3 md:gap-4">
      {blocks.map((b) => (
        <div key={b.label} className="flex flex-col items-center">
          <div className="card-clean rounded-xl w-14 h-14 md:w-18 md:h-18 flex items-center justify-center text-2xl md:text-3xl font-bold text-text-primary">
            {String(b.value).padStart(2, '0')}
          </div>
          <span className="text-xs md:text-sm text-text-secondary mt-1">{b.label}</span>
        </div>
      ))}
    </div>
  );
}
