import { forwardRef, ReactNode, MouseEventHandler } from 'react';
import { ButtonVariant } from './Button.types.ts';

// 2. Маппинг вариантов на классы Tailwind
const variantClasses = {
  [ButtonVariant.PRIMARY]: 'text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
  [ButtonVariant.SUCCESS]: 'text-white bg-green-500 hover:bg-green-700 focus:ring-green-500',
  [ButtonVariant.DANGER]: 'text-white bg-red-500 hover:bg-red-700 focus:ring-red-500',
  [ButtonVariant.WARNING]: 'text-white bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500',
  [ButtonVariant.INFO]: 'text-white bg-cyan-500 hover:bg-cyan-700 focus:ring-cyan-500',
  [ButtonVariant.NEUTRAL]: 'text-gray-800 bg-gray-200 hover:bg-gray-300 focus:ring-gray-500',
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
    const baseClasses = 'inline-flex items-center px-3 py-1 text-sm leading-5 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors';
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
