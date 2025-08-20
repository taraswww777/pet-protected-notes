import { FC, PropsWithChildren } from 'react';
import { Link, useLocation } from 'react-router';

const tabs = [
  { id: 'roles', label: 'Роли', path: '/dashboard/roles' },
  { id: 'actions', label: 'Действия', path: '/dashboard/actions' },
  { id: 'users', label: 'Пользователи', path: '/dashboard/users' },
  { id: 'history-log', label: 'История действий', path: '/dashboard/history-log' },
];

export const DashboardLayout: FC<PropsWithChildren> = ({ children }) => {
  const location = useLocation();

  const activeTab = tabs.find(tab => location.pathname.startsWith(tab.path))?.id || 'roles';

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Боковое меню */}
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <h1 className="text-xl font-bold mb-6 text-gray-800">Управление доступом</h1>

        <nav className="space-y-1">
          {tabs.map(tab => (
            <Link
              key={tab.id}
              to={tab.path}
              className={`block px-4 py-2 rounded-md text-sm font-medium ${
                activeTab === tab.id
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Основная область */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Контент */}
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
};
