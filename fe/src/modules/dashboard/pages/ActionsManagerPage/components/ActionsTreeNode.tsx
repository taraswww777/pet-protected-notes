import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { ActionTreeNode } from '../ActionsManagerPage.types.ts';

interface ActionsTreeNodeProps {
  node: ActionTreeNode;
  index: number;
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
  index,
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
      <Draggable draggableId={`${node.data.id}`} index={index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={`flex items-center py-2 px-4 ${level > 0 ? `pl-${level * 4}` : ''} hover:bg-gray-50`}
          >
            <div {...provided.dragHandleProps} className="mr-2 cursor-grab">≡</div>
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
        )}
      </Draggable>
      {isExpanded && node.children.length > 0 && (
        <div className="pl-4">
          {node.children?.map((childNode, childIndex) => (
            <ActionsTreeNode
              key={childNode.data.id}
              node={childNode}
              index={childIndex}
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

