import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export function RestockTimer() {
  const [timeLeft, setTimeLeft] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const minutes = now.getMinutes();
      
      // Calculate the next 5-minute mark
      // We want the next multiple of 5 minutes
      // e.g. 12:00 -> 12:05, 12:01 -> 12:05, 12:04 -> 12:05, 12:05 -> 12:10
      
      const remainder = minutes % 5;
      const minutesToAdd = 5 - remainder;
      
      let targetTime = new Date(now);
      targetTime.setMinutes(minutes + minutesToAdd);
      targetTime.setSeconds(0);
      targetTime.setMilliseconds(0);
      
      // Safety check: if target is in the past (shouldn't happen with above logic), add 5 mins
      if (targetTime.getTime() <= now.getTime()) {
          targetTime.setMinutes(targetTime.getMinutes() + 5);
      }

      const diff = targetTime.getTime() - now.getTime();
      
      const m = Math.floor(diff / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      
      setTimeLeft(`${m}:${s.toString().padStart(2, '0')}`);
      
      // Progress bar (fills up as we get closer to restock)
      // 5 minutes = 300,000 ms
      const totalDuration = 5 * 60 * 1000;
      const timeElapsed = totalDuration - diff;
      const pct = (timeElapsed / totalDuration) * 100;
      setProgress(pct);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 z-20">
      <div className="bg-white border-2 border-kahoot-blue rounded-full px-4 py-1 shadow-md flex items-center gap-2 whitespace-nowrap overflow-hidden relative">
        {/* Progress Background */}
        <div 
          className="absolute left-0 top-0 bottom-0 bg-blue-50 transition-all duration-1000 ease-linear -z-10"
          style={{ width: `${progress}%` }}
        />
        
        <Clock className="w-3.5 h-3.5 text-kahoot-blue animate-pulse" />
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          Restock: <span className="text-kahoot-blue text-sm font-black tabular-nums">{timeLeft}</span>
        </span>
      </div>
    </div>
  );
}
