export function TrustStrip() {
  const items = [
    'Tested Before Dispatch', 'Cash on Delivery',
    'Ships from Pakistan', 'WhatsApp Support',
    'Tested Before Dispatch', 'Cash on Delivery',
    'Ships from Pakistan', 'WhatsApp Support',
  ];
  return (
    <div className="bg-[#0a0a0a] py-2 overflow-hidden border-b border-gray-900">
      <div className="flex" style={{ animation: 'marquee 18s linear infinite' }}>
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-2 shrink-0 px-6">
            <span className="w-1 h-1 rounded-full bg-[#e01e1e] inline-block" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 whitespace-nowrap">{item}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function TrustBadges() { return null; }
