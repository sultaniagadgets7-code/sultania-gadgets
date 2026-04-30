'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface Props {
  label?: string;
  hours?: number; // reset every X hours
}

export function CountdownTimer({ label = 'Deal ends in', hours = 24 }: Props) {
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    function getEndTime() {
      const STORAGE_KEY = 'sultania_deal_end';
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const end = parseInt(stored);
          if (end > Date.now()) return end;
        }
        // Set new end time
        const end = Date.now() + hours * 60 * 60 * 1000;
        localStorage.setItem(STORAGE_KEY, String(end));
        return end;
      } catch {
        return Date.now() + hours * 60 * 60 * 1000;
      }
    }

    const endTime = getEndTime();

    function tick() {
      const diff = Math.max(0, endTime - Date.now());
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft({ h, m, s });
    }

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [hours]);

  if (!mounted) return null;

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="inline-flex items-center gap-2 bg-[#dc2626]/10 border border-[#dc2626]/20 rounded-full px-4 py-2">
      <Clock className="w-3.5 h-3.5 text-[#dc2626] shrink-0" aria-hidden="true" />
      <span className="text-xs font-semibold text-[#dc2626]">{label}:</span>
      <div className="flex items-center gap-1 font-mono font-black text-[#dc2626] text-sm">
        <span>{pad(timeLeft.h)}</span>
        <span className="opacity-60">:</span>
        <span>{pad(timeLeft.m)}</span>
        <span className="opacity-60">:</span>
        <span>{pad(timeLeft.s)}</span>
      </div>
    </div>
  );
}
