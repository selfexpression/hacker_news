import { FileOutlined, CarryOutOutlined } from '@ant-design/icons';

import type { Comment, TreeNode } from '@/types/definitions';
import { getCommentsById } from '@/app/lib/data';

export const generateTreeData = (
  comments: Comment[],
): TreeNode[] => comments.map(({ id, text, kids }) => ({
  key: id.toString(),
  title: text,
  isLeaf: !kids?.length,
  icon: !kids?.length && <FileOutlined />,
  children: kids?.length
    ? kids.map((kid) => (
      {
        key: kid.toString(),
        title: 'Loading...',
        icon: <CarryOutOutlined />,
        loaded: false,
      }
    ))
    : [],
}));

export const generateNestedTreeData = (
  comments: Comment[],
): Promise<TreeNode[]> => Promise.all(comments.map(async ({ id, text, kids }) => ({
  key: id.toString(),
  title: text,
  isLeaf: !kids?.length,
  icon: !kids?.length && <FileOutlined/>,
  children: kids?.length
    ? await generateNestedTreeData(await getCommentsById(kids))
    : [],
})));

export const updateTreeData = (
  list: TreeNode[],
  key: string,
  children: TreeNode[],
): TreeNode[] => list.map((node) => (node.key === key
  ? {
    ...node,
    children,
    loaded: true,
  }
  : {
    ...node,
    children: node.children
      ? updateTreeData(node.children, key, children)
      : node.children,
  }
));
