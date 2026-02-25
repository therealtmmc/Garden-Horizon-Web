import React, { useState, useEffect, useRef } from 'react';
import { Clock, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function RestockTimer() {
  const [timeLeft, setTimeLeft] = useState('');
  const [progress, setProgress] = useState(0);
  const [showRestockPopup, setShowRestockPopup] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastTriggeredTime = useRef<number>(0);

  useEffect(() => {
    // Request notification permission on mount
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Initialize audio
    audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/221/221-preview.mp3'); // Simple bell sound
    audioRef.current.volume = 0.5;

    const updateTimer = () => {
      const now = new Date();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      
      // Calculate the next 5-minute mark
      const remainder = minutes % 5;
      const minutesToAdd = 5 - remainder;
      
      let targetTime = new Date(now);
      targetTime.setMinutes(minutes + minutesToAdd);
      targetTime.setSeconds(0);
      targetTime.setMilliseconds(0);
      
      // Safety check
      if (targetTime.getTime() <= now.getTime()) {
          targetTime.setMinutes(targetTime.getMinutes() + 5);
      }

      const diff = targetTime.getTime() - now.getTime();
      
      // Check if we just hit the mark (within last second) and haven't triggered yet for this interval
      // We check if seconds is 0 and remainder is 0 (exact 5 min mark)
      const currentTimeBlock = Math.floor(now.getTime() / (5 * 60 * 1000));
      
      if (remainder === 0 && seconds === 0 && lastTriggeredTime.current !== currentTimeBlock) {
        triggerRestockNotification();
        lastTriggeredTime.current = currentTimeBlock;
      }

      const m = Math.floor(diff / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      
      setTimeLeft(`${m}:${s.toString().padStart(2, '0')}`);
      
      // Progress bar
      const totalDuration = 5 * 60 * 1000;
      const timeElapsed = totalDuration - diff;
      const pct = (timeElapsed / totalDuration) * 100;
      setProgress(pct);
    };

    const triggerRestockNotification = () => {
      setShowRestockPopup(true);
      
      // Play sound
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(e => console.log("Audio play failed:", e));
      }

      // Send Browser Notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Garden Horizon Restock!', {
          body: 'New plants are available in the shop now!',
          icon: '/logo.png', // Uses the public logo if available, or fallback
          silent: true // We play our own sound
        });
      }

      // Hide popup after 5 seconds
      setTimeout(() => {
        setShowRestockPopup(false);
      }, 5000);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
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

      {/* Restock Popup Animation */}
      <AnimatePresence>
        {showRestockPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -50 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-kahoot-yellow border-4 border-yellow-600 text-white px-8 py-4 rounded-3xl shadow-[0_10px_40px_rgba(255,193,7,0.6)] flex items-center gap-4"
          >
            <div className="bg-white/20 p-3 rounded-full animate-[bounce_1s_infinite]">
              <Bell className="w-8 h-8 text-white" fill="currentColor" />
            </div>
            <div>
              <h3 className="text-2xl font-black uppercase tracking-wide drop-shadow-md">Restock!</h3>
              <p className="font-bold text-yellow-100 text-sm">New plants available now</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
