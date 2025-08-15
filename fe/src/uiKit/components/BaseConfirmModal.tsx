import React from 'react';
import { BaseModal } from './BaseModal';

interface BaseConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export const BaseConfirmModal: React.FC<BaseConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Подтвердить',
  cancelText = 'Отмена',
}) => {
  const footer = (
    <div className="flex justify-end space-x-4">
      <button
        className="px-4 py-2 text-gray-600 hover:text-gray-800"
        onClick={onClose}
      >
        {cancelText}
      </button>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={onConfirm}
      >
        {confirmText}
      </button>
    </div>
  );

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} footer={footer} title={title}>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-gray-600">{message}</p>
      </div>
    </BaseModal>
  );
};
