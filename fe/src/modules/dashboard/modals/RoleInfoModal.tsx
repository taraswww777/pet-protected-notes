import React, { useState, useEffect } from 'react';
import { BaseModal } from '../../../uiKit/components/BaseModal';
import { UIRole } from '../../../types/UIRole.ts';
import { Input } from '../../../uiKit/form/Input';
import { Textarea } from '../../../uiKit/form/Textarea.tsx';

type RoleInfoModalProps = {
  isOpen: boolean;
  onClose: () => void;
  role: UIRole | null;
  onSave: (roleData: { name: string; description: string }) => void;
};

export const RoleInfoModal = ({ isOpen, onClose, role, onSave }: RoleInfoModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name || '',
        description: role.description || '',
      });
    } else {
      setFormData({
        name: '',
        description: '',
      });
    }
  }, [role]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const footer = (
    <div className="flex justify-end space-x-3">
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Отмена
      </button>
      <button
        type="submit"
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
      >
        Сохранить
      </button>
    </div>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      footer={footer}
      title={role ? 'Редактирование роли' : 'Добавление новой роли'}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Название роли"
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <Textarea
          label="Описание"
          name="description"
          id="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
        />
      </form>
    </BaseModal>
  );
};
