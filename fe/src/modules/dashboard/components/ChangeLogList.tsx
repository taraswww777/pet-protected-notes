import { schema } from 'protected-notes-be/src/db';
import { ClockIcon, UserIcon } from '../../../uiKit/Icons';
import { Badge, BadgeVariant } from '../../../uiKit/Badge';

export type ReachChangeLogEntry = schema.SystemLogSelect & {
  user?: schema.UserSelect | null;
};

type ChangeLogListProps = {
  changeLog: ReachChangeLogEntry[];
};

// Функция для преобразования уровня лога в вариант Badge
const getBadgeVariantFromLogLevel = (level: string): BadgeVariant => {
  const variantMap: Record<string, BadgeVariant> = {
    INFO: BadgeVariant.INFO,
    SUCCESS: BadgeVariant.SUCCESS,
    ERROR: BadgeVariant.ERROR,
    WARNING: BadgeVariant.WARNING,
    DEBUG: BadgeVariant.DEBUG,
    CRITICAL: BadgeVariant.CRITICAL,
  };
  return variantMap[level] || BadgeVariant.NEUTRAL;
};

export const ChangeLogList = ({ changeLog }: ChangeLogListProps) => {
  if (changeLog.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        Журнал изменений пуст
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <caption className="sr-only">Журнал изменений системы</caption>
        <thead className="bg-gray-50">
        <tr>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Действие
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Пользователь
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Время
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Уровень
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Данные
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Meta
          </th>
        </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
        {changeLog.map((entry) => (
          <tr key={entry.id}>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {entry.eventType}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <div className="flex items-center">
                <UserIcon className="h-4 w-4 mr-2 text-gray-400" aria-hidden="true" />
                <div>
                  <div className="text-blue-600">ID: {entry.user?.id ?? 'N/A'}</div>
                  <div className="text-xs text-gray-400">{entry.user?.login ?? 'N/A'}</div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <div className="flex items-center">
                <ClockIcon className="h-4 w-4 mr-2 text-gray-400" aria-hidden="true" />
                <time dateTime={new Date(entry.attemptTime).toISOString()}>
                  {new Date(entry.attemptTime).toLocaleString('ru-RU')}
                </time>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
              <Badge variant={getBadgeVariantFromLogLevel(entry.logLevel)}>
                {entry.logLevel}
              </Badge>
            </td>
            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
              {Boolean(entry.data && Object.keys(entry.data).length > 0) && (
                <details className="cursor-pointer">
                  <summary className="text-blue-600 hover:text-blue-800">
                    <strong>Показать данные</strong>
                  </summary>
                  <pre className="text-xs mt-1 overflow-auto p-2 bg-gray-50 rounded">
                      {JSON.stringify(entry.data, null, 2)}
                    </pre>
                </details>
              )}
            </td>
            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
              {Boolean(entry.metadata && Object.keys(entry.metadata).length > 0) && (
                <details className="cursor-pointer">
                  <summary className="text-blue-600 hover:text-blue-800">
                    <strong>Показать метаданные</strong>
                  </summary>
                  <pre className="text-xs mt-1 overflow-auto p-2 bg-gray-50 rounded">
                      {JSON.stringify(entry.metadata, null, 2)}
                    </pre>
                </details>
              )}
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
};
