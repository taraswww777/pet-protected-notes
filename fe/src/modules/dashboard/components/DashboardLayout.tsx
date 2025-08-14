import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router';

const tabs = [
  { id: 'roles', label: 'Роли', path: '/dashboard/roles' },
  { id: 'actions', label: 'Действия', path: '/dashboard/actions' },
  { id: 'users', label: 'Пользователи', path: '/dashboard/users' },
  { id: 'settings', label: 'Настройки', path: '/dashboard/settings' },
];

export const DashboardLayout = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

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
        {/* Шапка с поиском и кнопкой */}
        <header className="bg-white border-b border-gray-200 p-4">
          <div className="flex justify-between items-center">
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Поиск..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {activeTab === 'roles' && (
              <Link
                to="/dashboard/roles/create"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Добавить роль
              </Link>
            )}
          </div>
        </header>

        {/* Контент */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet context={{ searchQuery }} />
        </main>
      </div>
    </div>
  );
};
