import { useState } from 'react';
import { BaseModal } from '../../../uiKit/components/BaseModal';

type RoleUsersModalProps = {
  isOpen: boolean;
  onClose: () => void;
  role: { id: number; name: string; userCount: number };
  onAddUsers: (userIds: string[]) => void;
  onRemoveUser: (userId: string) => void;
};

export const RoleUsersModal = ({
  isOpen,
  onClose,
  role,
  onAddUsers,
  onRemoveUser,
}: RoleUsersModalProps) => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const footer = (
    <div className="flex justify-between">
      <button
        type="button"
        onClick={() => onAddUsers(selectedUsers)}
        className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
      >
        Добавить выбранных
      </button>
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Закрыть
      </button>
    </div>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      footer={footer}
      title={`Пользователи роли "${role.name}"`}
      maxWidth="2xl"
      fullHeight
    >
      <div className="flex justify-between items-center mb-4">
        <p>Всего пользователей: {role.userCount}</p>
        <button
          onClick={() => {/* логика добавления пользователей */
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Добавить пользователей
        </button>
      </div>

      {/* Здесь будет список пользователей с чекбоксами */}
      <div className="space-y-2">
        {/* Пример пользователя */}
        <div className="flex items-center justify-between p-2 border rounded">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={selectedUsers.includes('user1')}
              onChange={() => setSelectedUsers(prev =>
                prev.includes('user1')
                  ? prev.filter(id => id !== 'user1')
                  : [...prev, 'user1'],
              )}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2">user1@example.com</span>
          </div>
          <button
            onClick={() => onRemoveUser('user1')}
            className="text-red-600 hover:text-red-800"
          >
            Удалить
          </button>
        </div>
      </div>
    </BaseModal>
  );
};
