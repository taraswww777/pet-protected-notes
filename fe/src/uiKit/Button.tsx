import { forwardRef, ReactNode } from 'react';

interface ButtonProps {
  type: 'button' | 'submit' | 'reset';
  children: ReactNode;
  disabled?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  type,
  children,
  disabled,
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      type={type}
      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      disabled={!!disabled}
      {...props}
    >
      {children}
    </button>
  );
});
