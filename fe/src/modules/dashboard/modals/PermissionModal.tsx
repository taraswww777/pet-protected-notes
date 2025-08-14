import { useState, useEffect } from 'react';
import { XMarkIcon, CheckIcon, BanIcon, RefreshIcon, SearchIcon } from '../../../uiKit/Icons';

type Permission = {
  id: number;
  code: string;
  name: string;
  parentId: number | null;
  allowed: boolean;
};

/**
 * Продвинутый компонент для управления правами с иерархической структурой
 * @param {Object} props - Свойства компонента
 * @param {boolean} props.isOpen - Флаг открытия модального окна
 * @param {Function} props.onClose - Колбек закрытия модалки
 * @param {Function} props.onSave - Колбек сохранения прав (принимает массив Permission)
 *
 * @example
 * <PermissionModal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   onSave={(perms) => updatePermissions(roleId, perms)}
 * />
 *
 * @advantages
 * - Поддержка древовидной структуры прав (родительские/дочерние элементы)
 * - Встроенный поиск по правам
 * - Групповые операции (разрешить/запретить всё)
 * - Визуальная группировка по категориям
 * - Подробная типизация прав (id, code, name, parentId)
 *
 * @disadvantages
 * - Сложнее в интеграции (требует структурированных данных)
 * - Избыточен для простых сценариев
 * - Больший вес компонента
 */
export const PermissionModal = ({
  isOpen,
  onClose,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (permissions: Permission[]) => void;
}) => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<number[]>([]);

  // Загрузка прав (заглушка)
  useEffect(() => {
    if (isOpen) {
      // Пример данных с группировкой
      const mockPermissions: Permission[] = [
        { id: 1, code: 'users', name: 'Управление пользователями', parentId: null, allowed: true },
        { id: 2, code: 'users.create', name: 'Создание пользователей', parentId: 1, allowed: true },
        { id: 3, code: 'users.edit', name: 'Редактирование пользователей', parentId: 1, allowed: false },
        { id: 4, code: 'content', name: 'Управление контентом', parentId: null, allowed: true },
        { id: 5, code: 'content.create', name: 'Создание контента', parentId: 4, allowed: true },
      ];
      setPermissions(mockPermissions);
      setExpandedGroups(mockPermissions.filter(p => !p.parentId).map(p => p.id));
    }
  }, [isOpen]);

  const togglePermission = (id: number) => {
    setPermissions(prev =>
      prev.map(p => (p.id === id ? { ...p, allowed: !p.allowed } : p)),
    );
  };

  const toggleGroup = (groupId: number) => {
    setExpandedGroups(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId],
    );
  };

  const toggleAll = (allow: boolean) => {
    setPermissions(prev => prev.map(p => ({ ...p, allowed: allow })));
  };

  const resetPermissions = () => {
    setPermissions(prev => prev.map(p => ({ ...p, allowed: false })));
  };

  const filteredPermissions = permissions.filter(permission =>
    permission.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const parentPermissions = filteredPermissions.filter(p => !p.parentId);
  const childPermissions = filteredPermissions.filter(p => p.parentId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-semibold">Настройка прав роли</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XMarkIcon />
          </button>
        </div>

        <div className="p-4 border-b">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Поиск по названию действия..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {parentPermissions.map(parent => (
              <div key={parent.id} className="border rounded-md overflow-hidden">
                <div
                  className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer"
                  onClick={() => toggleGroup(parent.id)}
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={permissions.filter(p => p.parentId === parent.id).every(p => p.allowed)}
                      onChange={(e) => {
                        const newPermissions = permissions.map(p =>
                          p.parentId === parent.id ? { ...p, allowed: e.target.checked } : p,
                        );
                        setPermissions(newPermissions);
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span className="ml-2 font-medium">{parent.name}</span>
                  </div>
                  <span className="text-gray-500">
                    {expandedGroups.includes(parent.id) ? '−' : '+'}
                  </span>
                </div>

                {expandedGroups.includes(parent.id) && (
                  <div className="p-2 space-y-2">
                    {childPermissions
                      .filter(child => child.parentId === parent.id)
                      .map(child => (
                        <div key={child.id} className="flex items-center pl-6 pr-3 py-2">
                          <input
                            type="checkbox"
                            checked={child.allowed}
                            onChange={() => togglePermission(child.id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm">{child.name}</span>
                          <span className="ml-auto text-xs text-gray-500">{child.code}</span>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="border-t p-4 flex justify-between">
          <div className="space-x-2">
            <button
              type="button"
              onClick={() => toggleAll(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <CheckIcon className="mr-1" />
              Разрешить всё
            </button>
            <button
              type="button"
              onClick={() => toggleAll(false)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <BanIcon className="mr-1" />
              Запретить всё
            </button>
            <button
              type="button"
              onClick={resetPermissions}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <RefreshIcon className="mr-1" />
              Сбросить
            </button>
          </div>
          <div className="space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Отмена
            </button>
            <button
              type="button"
              onClick={() => onSave(permissions)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
            >
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
