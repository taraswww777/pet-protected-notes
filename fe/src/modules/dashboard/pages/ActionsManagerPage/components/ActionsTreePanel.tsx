import React from 'react';
import { ActionsTreeNode } from './ActionsTreeNode';
import { TreeNode } from '../../../../../utils/treeUtils.ts';
import { ActionTreeNode } from '../ActionsManagerPage.types.ts';
import { ActionWithRoles } from '../../../../../api/ActionsManagerApi.ts';

interface ActionsTreePanelProps {
  treeData: TreeNode<ActionWithRoles>[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedActions: Set<number>;
  onToggleActionSelection: (id: number) => void;
  expandedNodes: Set<number>;
  onToggleNode: (id: number) => void;
  onActionSelect: (action: TreeNode<ActionWithRoles>) => void;
  selectedAction?: ActionTreeNode;
  onAssignRoles: (roleIds: number[]) => void;
}

export const ActionsTreePanel: React.FC<ActionsTreePanelProps> = ({
  treeData,
  searchTerm,
  onSearchChange,
  selectedActions,
  onToggleActionSelection,
  expandedNodes,
  onToggleNode,
  onActionSelect,
  selectedAction,
  onAssignRoles,
}) => {
  return (
    <div className="w-1/3 border-r bg-white">
      <div className="p-4 border-b">
        <input
          type="text"
          placeholder="Поиск по коду/названию..."
          className="w-full p-2 border rounded"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {selectedActions.size > 0 && (
        <div className="p-2 bg-blue-50 border-b flex justify-between">
          <span>Выбрано: {selectedActions.size}</span>
          <button
            onClick={() => onAssignRoles([1])}
            className="text-blue-600 hover:text-blue-800"
          >
            Назначить роли
          </button>
        </div>
      )}

      {treeData.map((node) => (
        <ActionsTreeNode
          key={node.data.id}
          node={node}
          level={0}
          selectedActions={selectedActions}
          onToggleActionSelection={onToggleActionSelection}
          expandedNodes={expandedNodes}
          onToggleNode={onToggleNode}
          onActionSelect={onActionSelect}
          selectedAction={selectedAction}
        />
      ))}
    </div>
  );
};
