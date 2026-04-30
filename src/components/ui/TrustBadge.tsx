import { TRUST_ITEMS } from '@/lib/config';

export function TrustStrip() {
  const allItems = [
    ...TRUST_ITEMS,
    'Free Exchange on Defects',
    '100% Genuine Products',
    'Nationwide Delivery',
    'No Advance Payment',
    'Tested Before Dispatch',
    'WhatsApp Support',
  ];
  // Duplicate for seamless marquee
  const items = [...allItems, ...allItems];
  return (
    <div className="bg-[#dc2626] py-2 overflow-hidden border-b border-[#b91c1c]">
      <div className="flex" style={{ animation: 'marquee 28s linear infinite' }}>
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-2 shrink-0 px-6">
            <span className="w-1 h-1 rounded-full bg-white inline-block" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-white/80 whitespace-nowrap">{item}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function TrustBadges() { return null; }
