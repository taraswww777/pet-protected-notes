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


const ActionsManagerPage = () => {
  // Пример данных
  const [actions, setActions] = useState<ActionWithRoles[]>([]);

  const [roles, setRoles] = useState<schema.RolesSelect[]>([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState<ActionTreeNode>();
  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set());
  const [selectedActions, setSelectedActions] = useState<Set<number>>(new Set());

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

  useMountEffect(() => {
    RoleServiceApi.getRoles().then(setRoles)
    ActionManagerApi.getActions().then(setActions)
  });

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
          onAddRoles={() => {/* TODO */
          }}
          onRemoveRole={() => {/* TODO */
          }}
        />
      </div>
    </DashboardPageBaseTemplate>
  );
};

export default ActionsManagerPage;
