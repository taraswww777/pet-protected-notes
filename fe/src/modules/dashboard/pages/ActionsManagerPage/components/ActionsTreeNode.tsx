import React from 'react';
import { ActionTreeNode } from '../ActionsManagerPage.types.ts';

interface ActionsTreeNodeProps {
  node: ActionTreeNode;
  level: number;
  selectedActions: Set<number>;
  onToggleActionSelection: (id: number) => void;
  expandedNodes: Set<number>;
  onToggleNode: (id: number) => void;
  onActionSelect: (action: ActionTreeNode) => void;
  selectedAction?: ActionTreeNode;
}

export const ActionsTreeNode: React.FC<ActionsTreeNodeProps> = ({
  node,
  level,
  selectedActions,
  onToggleActionSelection,
  expandedNodes,
  onToggleNode,
  onActionSelect,
  selectedAction,
}) => {
  const isExpanded = expandedNodes.has(node.data.id);
  const isSelected = selectedAction?.data?.id === node.data.id;

  return (
    <>
      <div className={`flex items-center py-2 px-4 ${level > 0 ? `pl-${level * 4}` : ''} hover:bg-gray-50`}>
        <input
          type="checkbox"
          checked={selectedActions.has(node.data.id)}
          onChange={() => onToggleActionSelection(node.data.id)}
          className="mr-2"
        />
        {node.children.length > 0 && (
          <button
            onClick={() => onToggleNode(node.data.id)}
            className="mr-2 w-4 text-center"
          >
            {isExpanded ? '−' : '+'}
          </button>
        )}
        <div
          className={`flex-1 cursor-pointer ${isSelected ? 'font-bold' : ''}`}
          onClick={() => onActionSelect(node)}
        >
          {node.data.name} <span className="text-gray-500 text-sm">({node.data.code})</span>
        </div>
      </div>
      {isExpanded && node.children.length > 0 && (
        <div className="pl-4">
          {node.children?.map((childNode) => (
            <ActionsTreeNode
              key={childNode.data.id}
              node={childNode}
              level={level + 1}
              selectedActions={selectedActions}
              onToggleActionSelection={onToggleActionSelection}
              expandedNodes={expandedNodes}
              onToggleNode={onToggleNode}
              onActionSelect={onActionSelect}
              selectedAction={selectedAction}
            />
          ))}
        </div>
      )}
    </>
  );
};

