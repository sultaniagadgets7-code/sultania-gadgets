import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'sale' | 'new' | 'hot' | 'low-stock';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const v = {
    default:     'bg-gray-100 text-gray-600',
    sale:        'bg-[#e01e1e] text-white',
    new:         'bg-[#0a0a0a] text-white',
    hot:         'bg-[#e01e1e] text-white',
    'low-stock': 'bg-amber-50 text-amber-700',
  }[variant];

  return (
    <span className={cn('inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-full', v, className)}>
      {children}
    </span>
  );
}
