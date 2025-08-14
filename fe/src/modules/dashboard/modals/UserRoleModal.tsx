import React from 'react';
import { XMarkIcon } from '../../../uiKit/Icons.tsx';

type Role = {
  id: number;
  name: string;
};

type UserRoleModalProps = {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: number;
    login: string;
    roles: string[];
  };
  allRoles: Role[];
  onSave: (roles: string[]) => void;
};

export const UserRoleModal: React.FC<UserRoleModalProps> = ({
  isOpen,
  onClose,
  user,
  allRoles,
  onSave,
}) => {
  const [selectedRoles, setSelectedRoles] = React.useState<string[]>(user?.roles || []);

  const handleRoleChange = (roleName: string) => {
    setSelectedRoles(prev =>
      prev.includes(roleName)
        ? prev.filter(r => r !== roleName)
        : [...prev, roleName],
    );
  };

  // TODO: #99 UserRoleModal. Добавить валидацию ролей (например, минимально 1 роль должна быть выбрана)
  const handleSave = () => {
    onSave(selectedRoles);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-semibold">
            Изменение ролей для {user.login}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Текущие роли:
              </h3>
              <p className="text-sm text-gray-500">
                {user.roles.join(', ') || 'Нет ролей'}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Доступные роли:
              </h3>
              <div className="space-y-2">
                {allRoles.map((role) => (
                  <div key={role.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`role-${role.id}`}
                      checked={selectedRoles.includes(role.name)}
                      onChange={() => handleRoleChange(role.name)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor={`role-${role.id}`}
                      className="ml-2 block text-sm text-gray-700"
                    >
                      {role.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t p-4 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Отмена
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};

