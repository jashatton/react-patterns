import { useEffect, useState } from 'react';

interface TimerProps {
  interval?: number;
  onTick?: (time: number) => void;
  label?: string;
}

export function Timer({ interval = 1000, onTick, label = 'Elapsed Time' }: TimerProps) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => {
        const newTime = prevTime + 1;
        if (onTick) {
          onTick(newTime);
        }
        return newTime;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [interval, onTick]);

  return (
    <div className="text-center">
      <div className="text-sm text-gray-600 mb-1">{label}</div>
      <div className="text-2xl font-bold">{time}s</div>
    </div>
  );
}
