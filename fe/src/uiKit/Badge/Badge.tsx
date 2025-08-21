import { forwardRef, PropsWithChildren } from 'react';
import { BadgeVariant } from './Badge.types';

// Маппинг вариантов на классы Tailwind
const variantClasses = {
  [BadgeVariant.INFO]: 'bg-blue-100 text-blue-800',
  [BadgeVariant.SUCCESS]: 'bg-green-100 text-green-800',
  [BadgeVariant.ERROR]: 'bg-red-100 text-red-800',
  [BadgeVariant.WARNING]: 'bg-yellow-100 text-yellow-800',
  [BadgeVariant.DEBUG]: 'bg-purple-100 text-purple-800',
  [BadgeVariant.CRITICAL]: 'bg-red-800 text-white',
  [BadgeVariant.NEUTRAL]: 'bg-gray-100 text-gray-800',
};

interface BadgeProps {
  variant?: BadgeVariant;
  className?: string;
}

export const Badge = forwardRef<HTMLSpanElement, PropsWithChildren<BadgeProps>>(
  ({
    variant = BadgeVariant.NEUTRAL,
    children,
    className = '',
    ...props
  }, ref) => {

    // Динамически формируем классы
    const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    const variantClass = variantClasses[variant] || variantClasses[BadgeVariant.NEUTRAL];

    return (
      <span
        ref={ref}
        className={`${baseClasses} ${variantClass} ${className}`}
        {...props}
      >
        {children}
      </span>
    );
  },
);

Badge.displayName = 'Badge';
