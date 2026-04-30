'use client';

import { useState, useEffect, useCallback } from 'react';
import { ShoppingBag, X } from 'lucide-react';

const NAMES = [
  'Ahmed', 'Ali', 'Hassan', 'Usman', 'Bilal', 'Hamza', 'Zain', 'Omar',
  'Fatima', 'Ayesha', 'Sara', 'Hina', 'Sana', 'Nadia', 'Maria', 'Zara',
];
const CITIES = [
  'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad',
  'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala',
];
const TIMES = ['2 minutes ago', '5 minutes ago', '12 minutes ago', '28 minutes ago', 'just now', '1 hour ago'];

function random<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface Props {
  productTitle: string;
}

export function SocialProofToast({ productTitle }: Props) {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState({ name: '', city: '', time: '' });

  const show = useCallback(() => {
    setData({
      name: random(NAMES),
      city: random(CITIES),
      time: random(TIMES),
    });
    setVisible(true);
    setTimeout(() => setVisible(false), 4500);
  }, []);

  useEffect(() => {
    // First show after 8 seconds
    const first = setTimeout(show, 8000);
    // Then every 25–40 seconds
    const interval = setInterval(() => {
      show();
    }, Math.random() * 15000 + 25000);

    return () => {
      clearTimeout(first);
      clearInterval(interval);
    };
  }, [show]);

  return (
    <div
      className={`fixed bottom-20 md:bottom-6 left-4 z-50 max-w-[280px] transition-all duration-500 ${
        visible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 pointer-events-none'
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="bg-white border border-[#e2e8f0] rounded-2xl shadow-xl px-4 py-3 flex items-start gap-3">
        <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center shrink-0">
          <ShoppingBag className="w-4 h-4 text-green-600" aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-[#0f172a]">
            {data.name} from {data.city}
          </p>
          <p className="text-xs text-[#64748b] line-clamp-1">
            ordered <span className="font-semibold">{productTitle}</span>
          </p>
          <p className="text-[10px] text-[#94a3b8] mt-0.5">{data.time}</p>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="text-[#cbd5e1] hover:text-[#64748b] shrink-0 mt-0.5"
          aria-label="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
