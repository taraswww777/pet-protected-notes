export interface BaseTreeEntity {
  id: number,
  parentId?: number | null,
}

export interface TreeNode<T> {
  data: T
  children: TreeNode<T>[];
}

export const buildTree = <T extends BaseTreeEntity>(
  flatTree: T[],
  parentId?: number,
): TreeNode<T>[] => {
  return flatTree
    .filter(item => item.parentId == parentId)
    .map(item => ({
      data: item,
      children: buildTree(flatTree, item.id),
    }));
};
