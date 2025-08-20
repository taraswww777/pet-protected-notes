import { CogIcon } from '../../../uiKit/Icons.tsx';
import { FC } from 'react';
import { UserWithRolesDTO } from 'protected-notes-be/src/modules/role';
import { schema } from 'protected-notes-be/src/db';
import { Button, ButtonVariant } from '../../../uiKit/Button';


type UsersTableProps = {
  users: UserWithRolesDTO[];
  onEditRoles: (user: UserWithRolesDTO) => void;
  allRoles: schema.RolesSelect[];
};

export const UsersTable: FC<UsersTableProps> = ({ users, onEditRoles, allRoles }) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        {/* TODO: #100 UsersTable. Добавить сортировку по колонкам */}
        <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            ID
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Логин
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Роли
          </th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            Действия
          </th>
        </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
        {/* TODO: #101 UsersTable. Добавить empty state при отсутствии пользователей */}
        {users.map((user) => (
          <tr key={user.userId} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {user.userId}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {user.login}
            </td>
            <td className="px-6 py-4 text-sm text-gray-500">
              {allRoles.filter(roleItem => user.roleIds.includes(roleItem.id)).map(({ name }) => name).join(', ')}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <Button
                onClick={() => onEditRoles(user)}
                variant={ButtonVariant.PRIMARY}
              >
                <CogIcon className="mr-1" />
                Изменить роли
              </Button>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
};

