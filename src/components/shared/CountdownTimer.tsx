import { useState, useEffect } from 'react';

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

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const blocks = [
    { value: timeLeft.days, label: 'дней' },
    { value: timeLeft.hours, label: 'часов' },
    { value: timeLeft.minutes, label: 'минут' },
    { value: timeLeft.seconds, label: 'секунд' },
  ];

  return (
    <div className="flex gap-3 md:gap-4">
      {blocks.map((b) => (
        <div key={b.label} className="flex flex-col items-center">
          <div className="card-glass rounded-lg w-14 h-14 md:w-18 md:h-18 flex items-center justify-center text-2xl md:text-3xl font-bold text-accent">
            {String(b.value).padStart(2, '0')}
          </div>
          <span className="text-xs md:text-sm text-text-secondary mt-1">{b.label}</span>
        </div>
      ))}
    </div>
  );
}
