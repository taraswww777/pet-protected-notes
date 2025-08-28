import { forwardRef, ReactNode, MouseEventHandler } from 'react';
import { Link } from 'react-router';
import { ButtonVariant } from './Button.types.ts';
import { buttonVariantClasses } from './Button.constants.tsx';

// Интерфейс с явным указанием enum как типа
interface LinkButtonProps {
  variant?: ButtonVariant;
  children: ReactNode;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  className?: string;
  href?: string; // Для нативной ссылки
  to?: string; // Для ссылки через react-router-dom
}

export const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(
  (
    {
      variant = ButtonVariant.PRIMARY,
      children,
      disabled,
      className = '',
      href,
      to,
      ...props
    },
    ref,
  ) => {

    // Динамически формируем классы
    const baseClasses = 'inline-flex items-center px-3 py-1 text-sm leading-5 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors';
    const variantClass = buttonVariantClasses[variant] || buttonVariantClasses[ButtonVariant.PRIMARY];

    // Определяем, какой тип ссылки использовать
    const isRouterLink = !!to;

    const commonProps = {
      ref,
      className: `${baseClasses} ${variantClass} ${className}`,
      disabled: !!disabled,
      ...props,
    };

    if (isRouterLink) {
      return (
        <Link {...commonProps} to={to}>
          {children}
        </Link>
      );
    }

    return (
      <a {...commonProps} href={href}>
        {children}
      </a>
    );
  },
);

LinkButton.displayName = 'LinkButton';
