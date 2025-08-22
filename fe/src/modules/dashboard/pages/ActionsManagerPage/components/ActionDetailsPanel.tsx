import React from 'react';
import { ActionTreeNode } from '../ActionsManagerPage.types.ts';
import { schema } from 'protected-notes-be/src/db/index.ts';

interface ActionDetailsPanelProps {
  selectedAction?: ActionTreeNode;
  roles: schema.RolesSelect[];
  onEditAction: () => void;
  onAddRoles: () => void;
  onRemoveRole: (roleId: string) => void;
}

export const ActionDetailsPanel: React.FC<ActionDetailsPanelProps> = ({
  selectedAction,
  roles,
  onEditAction,
  onAddRoles,
  onRemoveRole,
}) => {
  if (!selectedAction) {
    return (
      <div className="w-2/3 p-6 overflow-y-auto">
        <div className="flex items-center justify-center h-full text-gray-500">
          Выберите действие для просмотра деталей
        </div>
      </div>
    );
  }

  return (
    <div className="w-2/3 p-6 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold">{selectedAction.data.name}</h2>
            <p className="text-gray-500">{selectedAction.data.code}</p>
          </div>
          <button
            onClick={onEditAction}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Редактировать
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Описание</h3>
          <p className="text-gray-700">{selectedAction.data.description}</p>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Роли с этим правом</h3>
            <button
              onClick={onAddRoles}
              className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm hover:bg-green-200"
            >
              + Добавить роли
            </button>
          </div>

          <div className="space-y-2">
            {selectedAction.data.roleIds.map(roleId => {
              const role = roles.find(r => r.id === roleId);

              return role ? (
                <div key={role.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span>{role.name}</span>
                  <button
                    onClick={() => onRemoveRole(`${roleId}`)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Удалить
                  </button>
                </div>
              ) : null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
