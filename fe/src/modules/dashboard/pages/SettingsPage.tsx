import { ClockIcon, UserIcon, DocumentTextIcon } from '../../../uiKit/Icons';
import { useState } from 'react';

type ChangeLogEntry = {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  action: string;
  target: string;
  timestamp: Date;
  details?: string;
};

const SettingsPage = () => {
  {/* TODO: #104 SettingsPage. Вынести моковые данные в отдельный файл или сервис. */}
  // Моковые данные для истории изменений
  const [changeLog] = useState<ChangeLogEntry[]>([
    {
      id: 1,
      user: {
        id: 1,
        name: 'Иван Петров',
        email: 'ivan@example.com',
      },
      action: 'изменил',
      target: 'роль "Администратор"',
      timestamp: new Date('2023-05-15T14:30:00'),
      details: 'Добавлено право "Удаление пользователей"',
    },
    {
      id: 2,
      user: {
        id: 2,
        name: 'Анна Сидорова',
        email: 'anna@example.com',
      },
      action: 'создал',
      target: 'новую роль "Модератор"',
      timestamp: new Date('2023-05-14T10:15:00'),
    },
    {
      id: 3,
      user: {
        id: 1,
        name: 'Иван Петров',
        email: 'ivan@example.com',
      },
      action: 'обновил',
      target: 'настройки системы',
      timestamp: new Date('2023-05-10T09:45:00'),
      details: 'Изменен интервал автоматического сохранения',
    },
  ]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Настройки системы</h1>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-medium">История изменений</h2>
          <p className="text-sm text-gray-500 mt-1">
            Последние изменения в системе
          </p>
        </div>

        <div className="divide-y divide-gray-200">
          {changeLog.map((entry) => (
            <div key={entry.id} className="px-6 py-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-blue-100 rounded-full p-2 leading-[0]">
                  <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">
                      <span className="text-blue-600">{entry.user.name}</span>{' '}
                      {entry.action} {entry.target}
                    </p>
                    <time
                      className="text-xs text-gray-500 flex items-center"
                      dateTime={entry.timestamp.toISOString()}
                    >
                      <ClockIcon className="h-3 w-3 mr-1" />
                      {entry.timestamp.toLocaleString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </time>
                  </div>
                  {entry.details && (
                    <p className="mt-1 text-sm text-gray-500 pl-2 border-l-2 border-gray-200">
                      {entry.details}
                    </p>
                  )}
                  <div className="mt-1 text-xs text-gray-400 flex items-center">
                    <UserIcon className="h-3 w-3 mr-1" />
                    {entry.user.email}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* TODO: #102 SettingsPage. Реализовать пагинацию для списка изменений. */}

        {/* TODO: #103 SettingsPage. Добавить обработчик. Добавить обработку ошибок при экспорте истории. */}
        <div className="bg-gray-50 px-6 py-3 text-right">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Экспорт истории
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
