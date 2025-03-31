import React, { PropsWithChildren } from 'react';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  footer?: React.ReactNode;
}

export const BaseModal: React.FC<PropsWithChildren<BaseModalProps>> = ({ isOpen, onClose, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      />
      <div className="relative z-50 bg-white rounded-lg p-6 max-w-lg w-full mx-4">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✕
        </button>
        <div className="px-4 py-2">
          {children}
        </div>
        {footer && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
