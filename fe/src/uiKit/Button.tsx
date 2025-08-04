import { forwardRef, ReactNode, MouseEventHandler } from 'react';

// 1. Определяем enum с вариантами
export enum ButtonVariant {
  PRIMARY = 'default',
  SUCCESS = 'success',
  DANGER = 'danger',
  WARNING = 'warning',
  INFO = 'info',
  NEUTRAL = 'neutral'
}

// 2. Маппинг вариантов на классы Tailwind
const variantClasses = {
  [ButtonVariant.PRIMARY]: 'bg-blue-500 hover:bg-blue-700 text-white focus:ring-blue-500',
  [ButtonVariant.SUCCESS]: 'bg-green-500 hover:bg-green-700 text-white focus:ring-green-500',
  [ButtonVariant.DANGER]: 'bg-red-500 hover:bg-red-700 text-white focus:ring-red-500',
  [ButtonVariant.WARNING]: 'bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-500',
  [ButtonVariant.INFO]: 'bg-cyan-500 hover:bg-cyan-700 text-white focus:ring-cyan-500',
  [ButtonVariant.NEUTRAL]: 'bg-gray-300 hover:bg-gray-400 text-gray-800 focus:ring-gray-500',
};

// 3. Интерфейс с явным указанием enum как типа
interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  variant?: ButtonVariant;
  children: ReactNode;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    type = 'button',
    variant = ButtonVariant.PRIMARY,
    children,
    disabled,
    className = '',
    ...props
  }, ref) => {

    // 4. Динамически формируем классы
    const baseClasses = 'flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors';
    const variantClass = variantClasses[variant] || variantClasses[ButtonVariant.PRIMARY];

    return (
      <button
        ref={ref}
        type={type}
        className={`${baseClasses} ${variantClass} ${className}`}
        disabled={!!disabled}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
