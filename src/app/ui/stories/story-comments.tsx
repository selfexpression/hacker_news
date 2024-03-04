'use client';

import { useState, useEffect } from 'react';
import { Tree } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import type { EventDataNode } from 'antd/es/tree';
import type { Key } from 'antd/es/table/interface';

import type { Comment } from '@/types/definitions';
import { getCommentsById } from '@/app/lib/data';

interface TreeNode {
  title: string;
  key: string;
  isLeaf?: boolean;
  children?: TreeNode[];
  loaded?: boolean;
}

const generateTreeData = (
  comments: Comment[],
): TreeNode[] => comments.map(({ id, text, kids }) => ({
  key: id.toString(),
  title: text,
  isLeaf: !kids?.length,
  children: kids?.length
    ? kids.map((kid) => ({ key: kid.toString(), title: 'Loading...' }))
    : [],
}));

const updateTreeData = (
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

export default function StoryComments({ comments }: { comments: Comment[] }) {
  const [treeData, setTreeData] = useState<TreeNode[]>([]);

  useEffect(() => {
    setTreeData(generateTreeData(comments));
  }, [comments]);

  const onLoadData = async (node: TreeNode) => {
    if (!node.isLeaf && !node.loaded) {
      const childComments = await getCommentsById(
        node.children?.map(({ key }) => key) || [],
      );

      return generateTreeData(childComments);
    }

    return node.children || [];
  };

  const onExpand = async (
    expandedKeys: Key[],
    { node, expanded }: { node: EventDataNode<TreeNode>; expanded: boolean },
  ) => {
    if (expanded) {
      const childNodes = await onLoadData(node);
      if (node.children?.some((child) => child.title === 'Loading...') || !node.loaded) {
        setTreeData((current) => updateTreeData(current, node.key, childNodes));
      }
    }
  };

  return (
    <Tree
      showLine
      switcherIcon={<DownOutlined />}
      loadData={onLoadData}
      onExpand={onExpand}
      treeData={treeData}
      defaultExpandParent
    />
  );
}
