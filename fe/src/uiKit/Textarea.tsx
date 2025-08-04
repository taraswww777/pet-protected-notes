import { InputVariant } from './Input';
import React from 'react';


interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  variant?: InputVariant;
  className?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, variant = InputVariant.DEFAULT, className = '', id, ...props }, ref) => {
    const textareaId = id || props.name || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const currentVariant = error ? InputVariant.DANGER : variant;

    const variantClasses = {
      [InputVariant.DEFAULT]: 'border-gray-300 focus:ring-blue-500 focus:border-blue-500',
      [InputVariant.PRIMARY]: 'border-blue-500 focus:ring-blue-500 focus:border-blue-500',
      [InputVariant.DANGER]: 'border-red-500 focus:ring-red-500 focus:border-red-500',
      [InputVariant.SUCCESS]: 'border-green-500 focus:ring-green-500 focus:border-green-500',
    };

    return (
      <div className={`${className}`}>
        {label && (
          <label
            htmlFor={textareaId}
            className={`block text-sm font-medium mb-1 ${
              error ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          className={`
            block w-full px-3 py-2 rounded-md shadow-sm
            border ${variantClasses[currentVariant]}
            focus:outline-none focus:ring-2 focus:ring-opacity-50
            disabled:opacity-50 disabled:cursor-not-allowed
            dark:bg-gray-700 dark:border-gray-600 dark:text-white
            ${props.disabled ? 'bg-gray-100 dark:bg-gray-800' : ''}
            min-h-[100px]
          `}
          {...props}
        />

        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';

export { Textarea };
