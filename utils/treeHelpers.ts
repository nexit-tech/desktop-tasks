import { TaskNode } from '@/types';

export const generateId = (): string => Math.random().toString(36).substr(2, 9);

export const updateTree = (nodes: TaskNode[], targetId: string, updateFn: (node: TaskNode) => TaskNode): TaskNode[] => {
  return nodes.map(node => {
    if (node.id === targetId) return updateFn(node);
    if (node.children.length > 0) {
      return { ...node, children: updateTree(node.children, targetId, updateFn) };
    }
    return node;
  });
};

export const deleteFromTree = (nodes: TaskNode[], targetId: string): TaskNode[] => {
  return nodes
    .filter(node => node.id !== targetId)
    .map(node => ({
      ...node,
      children: deleteFromTree(node.children, targetId)
    }));
};

export const addToTree = (nodes: TaskNode[], parentId: string | null, newNode: TaskNode): TaskNode[] => {
  if (parentId === null) return [...nodes, newNode];
  return updateTree(nodes, parentId, (node) => ({
    ...node,
    collapsed: false,
    children: [...node.children, newNode]
  }));
};