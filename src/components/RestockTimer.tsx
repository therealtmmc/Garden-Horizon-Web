import React, { useState, useEffect, useRef } from 'react';
import { Clock, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function RestockTimer() {
  const [timeLeft, setTimeLeft] = useState('');
  const [progress, setProgress] = useState(0);
  const [showRestockPopup, setShowRestockPopup] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  
  // Use Web Audio API for reliable sound generation without external files
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastTriggeredTime = useRef<number>(0);
  const alarmIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const dismissNotification = () => {
    setShowRestockPopup(false);
    // Stop the alarm loop
    if (alarmIntervalRef.current) {
      clearInterval(alarmIntervalRef.current);
      alarmIntervalRef.current = null;
    }
  };

  useEffect(() => {
    // Check initial permission
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }

    // Initialize AudioContext
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioContextClass();
    } catch (e) {
      console.error("Web Audio API not supported", e);
    }

    // Unlock audio context on first user interaction
    const unlockAudio = () => {
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('keydown', unlockAudio);
    };

    document.addEventListener('click', unlockAudio);
    document.addEventListener('keydown', unlockAudio);

    const playBellSound = () => {
      if (!audioCtxRef.current) return;
      const ctx = audioCtxRef.current;
      
      // Create oscillators for a bell-like tone
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      // Bell parameters
      const now = ctx.currentTime;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now); // A5
      osc.frequency.exponentialRampToValueAtTime(110, now + 1.5); // Pitch drop
      
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 1.5); // Decay
      
      osc.start(now);
      osc.stop(now + 1.5);
    };

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
      
      // Ensure AudioContext is running
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      // Play sound immediately
      playBellSound();

      // Loop sound every 800ms
      if (alarmIntervalRef.current) clearInterval(alarmIntervalRef.current);
      alarmIntervalRef.current = setInterval(playBellSound, 800);

      // Send Browser Notification
      if ('Notification' in window && Notification.permission === 'granted') {
        const notification = new Notification('Garden Horizon Restock!', {
          body: 'New plants are available in the shop now!',
          icon: '/logo.png',
          silent: true
        });
        
        // Close system notification after 5 seconds
        setTimeout(() => {
          notification.close();
        }, 5000);
      }

      // Auto-dismiss popup and stop sound after 5 seconds
      setTimeout(() => {
        dismissNotification();
      }, 5000);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => {
        clearInterval(interval);
        if (alarmIntervalRef.current) clearInterval(alarmIntervalRef.current);
        if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  const requestPermission = () => {
    if (!('Notification' in window)) return;
    Notification.requestPermission().then((perm) => {
      setPermission(perm);
    });
  };

  return (
    <>
      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1">
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

        {permission === 'default' && (
          <button 
            onClick={requestPermission}
            className="bg-white/90 hover:bg-white text-kahoot-blue text-[10px] font-bold px-3 py-1 rounded-full shadow-sm border border-kahoot-blue/20 flex items-center gap-1.5 transition-all animate-bounce"
          >
            <Bell className="w-3 h-3" />
            Enable Notifications
          </button>
        )}
      </div>

      {/* Restock Popup Animation */}
      <AnimatePresence>
        {showRestockPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -50 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-kahoot-yellow border-4 border-yellow-600 text-white px-8 py-4 rounded-3xl shadow-[0_10px_40px_rgba(255,193,7,0.6)] flex items-center gap-4 cursor-pointer hover:scale-105 transition-transform"
            onClick={dismissNotification}
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
