import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const Timer = ({ initialTime, onTimeUpdate }) => {
  const [time, setTime] = useState(initialTime);

  useEffect(() => {
    if (time <= 0) return;

    const interval = setInterval(() => {
      setTime(prevTime => {
        const newTime = prevTime - 1;
        onTimeUpdate(newTime);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [time, onTimeUpdate]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  
  const isLowTime = time <= 300; // 5 minutes

  return (
    <div className={`flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-lg ${isLowTime ? 'bg-red-100 dark:bg-red-900/30' : 'bg-secondary-100 dark:bg-secondary-800'}`}>
      <Clock className={`w-5 h-5 ${isLowTime ? 'text-red-600 dark:text-red-400' : 'text-secondary-600 dark:text-secondary-400'}`} />
      <span className={`font-mono font-semibold text-lg ${isLowTime ? 'text-red-600 dark:text-red-400' : 'text-secondary-800 dark:text-secondary-200'}`}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
};

export default Timer;
