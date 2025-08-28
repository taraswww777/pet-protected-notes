import { forwardRef, ReactNode, MouseEventHandler } from 'react';
import { ButtonVariant } from './Button.types.ts';
import { buttonVariantClasses } from './Button.constants.tsx';

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
    const baseClasses = 'inline-flex items-center px-4 py-2 text-sm leading-5 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors';
    const variantClass = buttonVariantClasses[variant] || buttonVariantClasses[ButtonVariant.PRIMARY];

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
