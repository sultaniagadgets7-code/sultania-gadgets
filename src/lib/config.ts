// ── Single source of truth for store-wide copy ───────────────
// Change here → updates everywhere automatically

export const SUPPORT = {
  hours: 'Mon–Sat 10 AM–8 PM, Sun 12–6 PM (PKT)',
  label: 'WhatsApp Support — Mon–Sat 10 AM–8 PM',
  shortLabel: 'Support: Mon–Sat 10 AM–8 PM',
  whatsappPrompt: 'Assalamualaikum, I need help.',
} as const;

export const SHIPPING = {
  mode: 'flat' as const,
  flatRate: 200,
  label: 'Flat Rs. 200 delivery fee',
  promoCopy: 'Rs. 200 delivery · Cash on Delivery',
  policyText: 'A flat delivery fee of Rs. 200 applies to all orders across Pakistan.',
} as const;

export const TRUST_ITEMS = [
  'Tested Before Dispatch',
  'Cash on Delivery',
  'Ships from Pakistan',
  'Earn Loyalty Points',
  SUPPORT.shortLabel,
] as const;
