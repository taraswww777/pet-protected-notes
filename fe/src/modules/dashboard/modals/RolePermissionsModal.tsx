import { useState } from 'react';
import { BaseModal } from '../../../uiKit/components/BaseModal';

type RolePermissionsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  role: { id: number; name: string };
  onPermissionsChange: (permissions: string[]) => void;
};

export const RolePermissionsModal = ({
  isOpen,
  onClose,
  role,
  onPermissionsChange,
}: RolePermissionsModalProps) => {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const handlePermissionToggle = (permission: string) => {
    setSelectedPermissions(prev =>
      prev.includes(permission)
        ? prev.filter(p => p !== permission)
        : [...prev, permission],
    );
  };

  const footer = (
    <div className="flex justify-end space-x-3">
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Закрыть
      </button>
      <button
        type="button"
        onClick={() => onPermissionsChange(selectedPermissions)}
        className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
      >
        Сохранить права
      </button>
    </div>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      footer={footer}
      title={`Права роли "${role.name}"`}
      maxWidth="lg"
      fullHeight
    >
      <div className="space-y-2">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="permission1"
            checked={selectedPermissions.includes('view_users')}
            onChange={() => handlePermissionToggle('view_users')}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="permission1" className="ml-2 block text-sm text-gray-700">
            Просмотр пользователей
          </label>
        </div>
        {/* Добавьте другие права по аналогии */}
      </div>
    </BaseModal>
  );
};
