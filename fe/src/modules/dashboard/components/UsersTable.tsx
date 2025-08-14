import { CogIcon } from '../../../uiKit/Icons.tsx';
import { FC } from 'react';


type User = {
  id: number;
  login: string;
  roles: string[];
};

type UsersTableProps = {
  users: User[];
  onEditRoles: (user: User) => void;
};

export const UsersTable: FC<UsersTableProps> = ({ users, onEditRoles }) => {
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
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {user.login}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {user.roles.join(', ')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEditRoles(user)}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <CogIcon className="mr-1" />
                  Изменить роли
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

