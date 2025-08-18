import React, { useEffect } from 'react';
import { XMarkIcon } from '../../../uiKit/Icons.tsx';
import { UserWithRolesDTO } from 'protected-notes-be/src/modules/role/index.ts';
import { Button, ButtonVariant } from '../../../uiKit/Button';

type Role = {
  id: number;
  name: string;
};

type UserRoleModalProps = {
  isOpen: boolean;
  onClose: () => void;
  user: UserWithRolesDTO;
  allRoles: Role[];
  onSave: (roleIds: number[]) => void;
};

export const UserRoleModal: React.FC<UserRoleModalProps> = ({
  isOpen,
  onClose,
  user,
  allRoles,
  onSave,
}) => {
  const [selectedRoleIds, setSelectedRoleIds] = React.useState<number[]>(user?.roleIds || []);

  useEffect(() => {
    setSelectedRoleIds(user?.roleIds || []);
  }, [user?.roleIds])

  const handleRoleChange = (roleId: number) => {
    setSelectedRoleIds(prev =>
      prev.includes(roleId)
        ? prev.filter(r => r !== roleId)
        : [...prev, roleId],
    );
  };

  // TODO: #99 UserRoleModal. Добавить валидацию ролей (например, минимально 1 роль должна быть выбрана)
  const handleSave = () => {
    onSave(selectedRoleIds);
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
            <div className="space-y-2">
              {allRoles.map((role) => (
                <div key={role.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`role-${role.id}`}
                    checked={selectedRoleIds.includes(role.id)}
                    onChange={() => handleRoleChange(role.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`role-${role.id}`}
                    className="ml-2 block text-sm text-gray-700"
                  >
                    {role.name}
                    {user.roleIds.includes(role.id) && (
                      <span className="ml-2 text-xs text-green-600">(текущая)</span>
                    )}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t p-4 flex justify-end space-x-3">
          <Button
            type="button"
            onClick={onClose}
            variant={ButtonVariant.NEUTRAL}
          >
            Отмена
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            variant={ButtonVariant.PRIMARY}
          >
            Сохранить
          </Button>
        </div>
      </div>
    </div>
  );
};
