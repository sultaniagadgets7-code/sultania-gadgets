import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'whatsapp' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
}

const V = {
  // Primary = black. Red is reserved for key CTAs only (handled inline where needed)
  primary:   'bg-[#0a0a0a] text-white hover:bg-gray-800 focus-visible:ring-gray-900',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-400',
  ghost:     'bg-transparent text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-400',
  whatsapp:  'bg-[#25D366] text-white hover:bg-[#20bd5a] focus-visible:ring-green-500',
  outline:   'bg-transparent text-[#0a0a0a] border border-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-white focus-visible:ring-gray-900',
  danger:    'bg-[#e01e1e] text-white hover:bg-[#c01818] focus-visible:ring-red-500',
};
const S = {
  sm: 'px-4 py-2 text-xs gap-1.5',
  md: 'px-5 py-2.5 text-sm gap-2',
  lg: 'px-7 py-3.5 text-sm gap-2',
  xl: 'px-9 py-4 text-sm gap-2',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, className, children, disabled, ...props }, ref) => (
    <button ref={ref} disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center font-bold uppercase tracking-widest rounded-full transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        V[variant], S[size], className
      )}
      {...props}>
      {loading && (
        <svg className="animate-spin h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  )
);
Button.displayName = 'Button';
