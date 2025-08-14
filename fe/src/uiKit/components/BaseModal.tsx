import React, { PropsWithChildren } from 'react';
import { XMarkIcon } from '../Icons.tsx';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  fullHeight?: boolean;
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
};

export const BaseModal: React.FC<PropsWithChildren<BaseModalProps>> = ({
  isOpen,
  onClose,
  children,
  footer,
  title,
  maxWidth = 'lg',
  fullHeight = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      <div className={`relative z-50 bg-white rounded-lg shadow-xl w-full ${maxWidthClasses[maxWidth]} ${
        fullHeight ? 'max-h-[90vh]' : ''
      } flex flex-col`}>
        <div className="flex justify-between items-center border-b p-4">
          {title && <h2 className="text-xl font-semibold">{title}</h2>}
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close modal"
          >
            <XMarkIcon />
          </button>
        </div>

        <div className={`flex-1 ${fullHeight ? 'overflow-y-auto' : ''} p-4 border-b`}>
          {children}
        </div>

        {footer && (
          <div className="p-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
