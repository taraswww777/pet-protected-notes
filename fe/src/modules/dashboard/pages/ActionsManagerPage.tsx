import React, { useState, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { DashboardPageBaseTemplate } from '../components/DashboardPageBaseTemplate.tsx';


interface Action {
  id: string;
  code: string;
  name: string;
  description: string;
  parentId: string | null;
  roles: string[];
}

interface Role {
  id: string;
  name: string;
}

// Добавляем интерфейс для узла дерева
interface TreeNode extends Action {
  children: TreeNode[];
}

const ActionsManagerPage = () => {
  // Пример данных
  const [actions, setActions] = useState<Action[]>([
    {
      id: '1',
      code: 'user:read',
      name: 'Просмотр пользователей',
      description: 'Доступ к просмотру списка пользователей',
      parentId: null,
      roles: ['admin'],
    },
    {
      id: '2',
      code: 'user:edit',
      name: 'Редактирование пользователей',
      description: 'Доступ к редактированию пользователей',
      parentId: null,
      roles: ['admin'],
    },
    {
      id: '3',
      code: 'report:view',
      name: 'Просмотр отчетов',
      description: 'Доступ к просмотру отчетов',
      parentId: null,
      roles: ['manager', 'admin'],
    },
    {
      id: '4',
      code: 'report:export',
      name: 'Экспорт отчетов',
      description: 'Доступ к экспорту отчетов',
      parentId: '3',
      roles: ['admin'],
    },
  ]);

  const [roles] = useState<Role[]>([
    { id: 'admin', name: 'Администратор' },
    { id: 'manager', name: 'Менеджер' },
    { id: 'user', name: 'Пользователь' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [selectedActions, setSelectedActions] = useState<Set<string>>(new Set());

  // Фильтрация и построение дерева
  const filteredActions = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return actions.filter(action => {
      return Boolean(action.code.toLowerCase().includes(term) || action.name.toLowerCase().includes(term));
    });
  }, [actions, searchTerm]);

  const treeData = useMemo(() => {
    const buildTree = (items: Action[], parentId: string | null = null): Array<TreeNode> => {
      return items
        .filter(item => item.parentId === parentId)
        .map(item => ({
          ...item,
          children: buildTree(items, item.id),
        }));
    };
    return buildTree(filteredActions);
  }, [filteredActions]);

  const toggleNode = (id: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedNodes(newExpanded);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(actions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setActions(items);
  };

  // Групповые операции
  const toggleActionSelection = (id: string) => {
    const newSelected = new Set(selectedActions);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedActions(newSelected);
  };

  const assignRolesToSelected = (roleIds: string[]) => {
    setActions(actions.map(action =>
      selectedActions.has(action.id)
        ? { ...action, roles: [...new Set([...action.roles, ...roleIds])] }
        : action));
    setSelectedActions(new Set());
  };

  // Рекурсивный рендеринг дерева
  const renderTree = (nodes: TreeNode[], level = 0) => {
    return nodes.map((node, index) => (
      <React.Fragment key={node.id}>
        <Draggable draggableId={node.id} index={index}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              className={`flex items-center py-2 px-4 ${level > 0 ? `pl-${level * 4}` : ''} hover:bg-gray-50`}
            >
              <div {...provided.dragHandleProps} className="mr-2 cursor-grab">≡</div>
              <input
                type="checkbox"
                checked={selectedActions.has(node.id)}
                onChange={() => toggleActionSelection(node.id)}
                className="mr-2"
              />
              {node.children.length > 0 && (
                <button
                  onClick={() => toggleNode(node.id)}
                  className="mr-2 w-4 text-center"
                >
                  {expandedNodes.has(node.id) ? '−' : '+'}
                </button>
              )}
              <div
                className={`flex-1 cursor-pointer ${selectedAction?.id === node.id ? 'font-bold' : ''}`}
                onClick={() => setSelectedAction(node)}
              >
                {node.name} <span className="text-gray-500 text-sm">({node.code})</span>
              </div>
            </div>
          )}
        </Draggable>
        {expandedNodes.has(node.id) && node.children.length > 0 && (
          <div className="pl-4">
            {renderTree(node.children, level + 1)}
          </div>
        )}
      </React.Fragment>
    ));
  };

  return (
    <DashboardPageBaseTemplate title={'ActionsManagerPage'}>
      <div className="flex h-screen bg-gray-50">
        {/* Левая панель - дерево действий */}
        <div className="w-1/3 border-r bg-white">
          <div className="p-4 border-b">
            <input
              type="text"
              placeholder="Поиск по коду/названию..."
              className="w-full p-2 border rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {selectedActions.size > 0 && (
            <div className="p-2 bg-blue-50 border-b flex justify-between">
              <span>Выбрано: {selectedActions.size}</span>
              <button
                onClick={() => {
                  // Например, назначаем всем выбранным админские права
                  assignRolesToSelected(['admin']);
                }}
                className="text-blue-600 hover:text-blue-800"
              >
                Назначить роли
              </button>
            </div>
          )}

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="actions">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="overflow-y-auto h-[calc(100%-110px)]"
                >
                  {renderTree(treeData)}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        {/* Правая панель - карточка действия */}
        <div className="w-2/3 p-6 overflow-y-auto">
          {selectedAction ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{selectedAction.name}</h2>
                  <p className="text-gray-500">{selectedAction.code}</p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Редактировать
                </button>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Описание</h3>
                <p className="text-gray-700">{selectedAction.description}</p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Роли с этим правом</h3>
                  <button
                    className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm hover:bg-green-200"
                    onClick={() => {
                      // TODO: #105 Реализовать диалоговое окно для выбора ролей и добавления их к действию
                      // При нажатии на кнопку должно открываться модальное окно со списком доступных ролей.
                      // После выбора ролей они должны быть добавлены к текущему действию.
                    }}
                  >
                    + Добавить роли
                  </button>
                </div>

                <div className="space-y-2">
                  {selectedAction.roles.map(roleId => {
                    const role = roles.find(r => r.id === roleId);
                    return role ? (
                      <div key={role.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span>{role.name}</span>
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() => {
                            // TODO: #106 Реализовать удаление роли из действия
                            // При нажатии на кнопку "Удалить" роль должна быть удалена из текущего действия.
                          }}
                        >
                          Удалить
                        </button>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Выберите действие для просмотра деталей
            </div>
          )}
        </div>
      </div>
    </DashboardPageBaseTemplate>
  );
};

export default ActionsManagerPage;
