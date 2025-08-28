import { InputHTMLAttributes, forwardRef } from 'react';
import { FieldError } from 'react-hook-form';
import { InputVariant } from './Input.types.ts';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: FieldError | string | null;
  variant?: InputVariant;
  fullWidth?: boolean;
  className?: string;
}

const variantClasses: Record<InputVariant, string> = {
  [InputVariant.DEFAULT]: 'border-gray-300 focus:ring-blue-500 focus:border-blue-500',
  [InputVariant.PRIMARY]: 'border-blue-500 focus:ring-blue-500 focus:border-blue-500',
  [InputVariant.DANGER]: 'border-red-500 focus:ring-red-500 focus:border-red-500',
  [InputVariant.SUCCESS]: 'border-green-500 focus:ring-green-500 focus:border-green-500',
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      variant = InputVariant.DEFAULT,
      fullWidth = false,
      className = '',
      id,
      type = 'text',
      ...props
    },
    ref,
  ) => {
    const inputId = id || props.name || `input-${Math.random().toString(36).substr(2, 9)}`;
    const isError = Boolean(error);
    const currentVariant = isError ? InputVariant.DANGER : variant;

    return (
      <div className={`${fullWidth ? 'w-full' : 'w-auto'} ${className}`}>
        {label && (
          <label
            htmlFor={inputId}
            className={`block text-sm font-medium mb-1 ${
              isError ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            {label}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          type={type}
          className={`
            block w-full px-3 py-2 rounded-md shadow-sm
            border ${variantClasses[currentVariant]}
            focus:outline-none focus:ring-2 focus:ring-opacity-50
            disabled:opacity-50 disabled:cursor-not-allowed
            dark:bg-gray-700 dark:border-gray-600 dark:text-white
            ${props.disabled ? 'bg-gray-100 dark:bg-gray-800' : ''}
          `}
          {...props}
        />

        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {typeof error === 'string' ? error : error.message}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export { Input };
