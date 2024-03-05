import { FileOutlined } from '@ant-design/icons';

import type { Comment, TreeNode } from '@/types/definitions';
import { getCommentsById } from '@/app/lib/data';

export const cleanText = (text: string): string => (
  text
    ? text
      .replace(/<a .*?>(.*?)<\/a>/g, ' $1 ')
      .replace(/<[^>]*>/g, ' ')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, '\'')
      .replace(/&nbsp;/g, ' ')
      .replace(/[^a-zA-Z\u0400-\u04FF\d\s,.!?']/g, '')
      .replace(/\s+/g, ' ')
      .trim()
    : ''
);

export const generateDate = (time: number): string => (
  new Date(time * 1000).toLocaleDateString()
);

export const generateTreeData = (
  comments: Comment[],
): TreeNode[] => comments.map(({ id, text, kids }) => ({
  key: id.toString(),
  title: cleanText(text),
  isLeaf: !kids?.length,
  icon: !kids?.length && <FileOutlined />,
  children: kids?.length
    ? kids.map((kid) => (
      {
        key: kid.toString(),
        title: 'Loading...',
        icon: <FileOutlined />,
        loaded: false,
      }
    ))
    : [],
}));

export const generateNestedTreeData = (
  comments: Comment[],
): Promise<TreeNode[]> => Promise.all(comments.map(async ({ id, text, kids }) => ({
  key: id.toString(),
  title: cleanText(text),
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
