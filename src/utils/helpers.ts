import type { Comment, TreeNode } from '@/types/definitions';

export const generateTreeData = (
  comments: Comment[],
): TreeNode[] => comments.map(({ id, text, kids }) => ({
  key: id.toString(),
  title: text,
  isLeaf: !kids?.length,
  children: kids?.length
    ? kids.map((kid) => ({ key: kid.toString(), title: 'Loading...' }))
    : [],
}));

export const updateTreeData = (
  list: TreeNode[],
  key: string,
  children: TreeNode[],
): TreeNode[] => list.map((node) => (node.key === key
  ? {
    ...node, children, loaded: true,
  }
  : {
    ...node,
    children: node.children
      ? updateTreeData(node.children, key, children)
      : node.children,
  }
));
