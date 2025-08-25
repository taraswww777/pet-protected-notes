import { useMemo, useState } from 'react';
import { DashboardPageBaseTemplate } from '../../components/DashboardPageBaseTemplate.tsx';
import { ActionsTreePanel } from './components/ActionsTreePanel.tsx';
import { ActionDetailsPanel } from './components/ActionDetailsPanel.tsx';
import { ActionTreeNode } from './ActionsManagerPage.types.ts';
import { buildTree } from '../../../../utils/treeUtils.ts';
import { useMountEffect } from '../../../../hooks/useMountEffect.ts';
import { RoleServiceApi } from '../../../../api/RoleServiceApi.ts';
import { schema } from 'protected-notes-be/src/db';
import { ActionManagerApi, ActionWithRoles } from '../../../../api/ActionsManagerApi.ts';
import { BaseConfirmModal } from '../../../../uiKit/components/BaseConfirmModal.tsx';
import { useNotification } from '../../../../services/NotificationService';
import { NotificationType } from '../../../../services/NotificationService/NotificationService.types.ts';
import { AddRolesToActionModal } from '../../modals/AddRolesToActionModal.tsx';


const ActionsManagerPage = () => {
  const { showNotification } = useNotification();
  const [actions, setActions] = useState<ActionWithRoles[]>([]);

  const [roles, setRoles] = useState<schema.RolesSelect[]>([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState<ActionTreeNode>();
  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set());
  const [selectedActions, setSelectedActions] = useState<Set<number>>(new Set());

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [actionToEdit, setActionToEdit] = useState<ActionWithRoles | null>(null);
  const [roleToRemove, setRoleToRemove] = useState<number | null>(null);

  // В компонент ActionsManagerPage добавляем состояние:
  const [isAddRolesModalOpen, setIsAddRolesModalOpen] = useState(false);
  const [selectedActionForRoles, setSelectedActionForRoles] = useState<ActionTreeNode | null>(null);

  const handleOpenAddRolesModal = (action: ActionTreeNode) => {
    setSelectedActionForRoles(action);
    setIsAddRolesModalOpen(true);
  };

  const handleCloseAddRolesModal = () => {
    setIsAddRolesModalOpen(false);
    setSelectedActionForRoles(null);
  };

  const openRemoveRoleModal = (action: ActionWithRoles, roleId: number) => {
    setActionToEdit(action);
    setRoleToRemove(roleId);
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setActionToEdit(null);
    setRoleToRemove(null);
  };

  // Фильтрация и построение дерева
  const filteredActions = useMemo(() => {
    const term = searchTerm.toLowerCase();
    if (!term) {
      return actions;
    }

    return actions.filter(action => {
      return Boolean(action.code.toLowerCase().includes(term) || action.name.toLowerCase().includes(term));
    });
  }, [actions, searchTerm]);

  const treeData = useMemo(() => buildTree(filteredActions), [filteredActions]);

  const toggleNode = (id: number) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedNodes(newExpanded);
  };

  // Групповые операции
  const toggleActionSelection = (id: number) => {
    const newSelected = new Set(selectedActions);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedActions(newSelected);
  };

  const assignRolesToSelected = (roleIds: number[]) => {
    setActions(actions.map(action =>
      selectedActions.has(action.id)
        ? { ...action, roleIds: [...new Set([...action.roleIds, ...roleIds])] }
        : action));
    setSelectedActions(new Set());
  };

  const loadData = () => {
    RoleServiceApi.getRoles().then(setRoles);
    ActionManagerApi.getActions().then(setActions);
  };

  useMountEffect(() => {
    loadData()
  });


  const handleRemoveRole = async (actionId: number, roleId: number) => {
    try {
      await RoleServiceApi.removeRoleFromAction(actionId, roleId);

      // Обновляем состояние, удаляя roleId из соответствующего действия
      setActions(prevActions => prevActions.map(action =>
        action.id === actionId
          ? { ...action, roleIds: action.roleIds.filter(id => id !== roleId) }
          : action,
      ));

      // Если редактируемое действие сейчас открыто, обновляем и его
      if (selectedAction && selectedAction.data.id === actionId) {
        setSelectedAction(prev => prev ? {
          ...prev,
          data: {
            ...prev.data,
            roleIds: prev.data.roleIds.filter(id => id !== roleId),
          },
        } : undefined);
      }

      // Показываем уведомление об успехе
      const roleName = roles.find(r => r.id === roleId)?.name || 'роль';
      const actionName = actions.find(a => a.id === actionId)?.name || 'действие';
      showNotification(`Роль "${roleName}" удалена из действия "${actionName}"`, { type: NotificationType.success });
    } catch (error) {
      console.error('Ошибка при удалении роли из действия:', error);
      // Здесь можно добавить обработку ошибок, например, показать уведомление об ошибке
      showNotification('Не удалось удалить роль из действия', { type: NotificationType.danger });
    } finally {
      // Закрываем модальное окно в любом случае (успех или ошибка)
      closeConfirmModal();
    }
  };

  return (
    <DashboardPageBaseTemplate title="Управление действиями">
      <div className="flex h-screen bg-gray-50">
        <ActionsTreePanel
          treeData={treeData}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedActions={selectedActions}
          onToggleActionSelection={toggleActionSelection}
          expandedNodes={expandedNodes}
          onToggleNode={toggleNode}
          onActionSelect={setSelectedAction}
          selectedAction={selectedAction}
          onAssignRoles={assignRolesToSelected}
        />

        <ActionDetailsPanel
          selectedAction={selectedAction}
          roles={roles}
          onEditAction={() => {/* TODO */
          }}
          onAddRoles={() => selectedAction && handleOpenAddRolesModal(selectedAction)}
          onRemoveRole={(roleId) => {
            if (selectedAction) {
              // Находим полный объект действия для передачи в модальное окно
              const action = actions.find(a => a.id === selectedAction.data.id);
              if (action) {
                openRemoveRoleModal(action, roleId);
              }
            }
          }}
        />
      </div>

      {selectedActionForRoles && (
        <AddRolesToActionModal
          isOpen={isAddRolesModalOpen}
          onClose={handleCloseAddRolesModal}
          actionId={selectedActionForRoles.data.id}
          existingRoleIds={selectedActionForRoles.data.roleIds}
          refreshData={loadData}
        />
      )}

      <BaseConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={closeConfirmModal}
        onConfirm={() => {
          if (actionToEdit && roleToRemove !== null) {
            handleRemoveRole(actionToEdit.id, roleToRemove);
          }
          closeConfirmModal();
        }}
        title="Подтверждение удаления"
        message={`Вы уверены, что хотите удалить роль из действия "${actionToEdit?.name}"?`}
        confirmText="Удалить"
        cancelText="Отмена"
      />
    </DashboardPageBaseTemplate>
  );
};

export default ActionsManagerPage;
