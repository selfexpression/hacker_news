'use client';

import { useState, useEffect } from 'react';
import { Tree } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import type { EventDataNode } from 'antd/lib/tree';
import type { Key } from 'antd/es/table/interface';

import type { Comment } from '@/types/definitions';
import { getCommentsById } from '@/app/lib/data';

interface TreeNode {
  title: string;
  key: string;
  children?: TreeNode[];
}

const generateTreeData = (comments: Comment[]): TreeNode[] => comments.map((comment) => ({
  title: comment.text,
  key: comment.id.toString(),
  children: comment.kids ? comment.kids.map((id) => ({
    key: id.toString(),
    title: 'Loading...',
  })) : [],
}));

export default function StoryComments({ comments }: { comments: Comment[] }) {
  const [treeData, setTreeData] = useState<TreeNode[]>([]);

  useEffect(() => {
    setTreeData(generateTreeData(comments));
  }, [comments]);

  const onLoadData = async (node: TreeNode): Promise<TreeNode[]> => {
    if (!node.children) return [];
    const childComments = await getCommentsById(node.children.map((child) => Number(child.key)));
    return generateTreeData(childComments);
  };

  const onExpand = async (
    expandedKeys: Key[],
    { node, expanded }: { node: EventDataNode<TreeNode>; expanded: boolean },
  ) => {
    if (!expanded || !node.children?.length) return;
    const children = await onLoadData(node);
    setTreeData((current) => (
      current.map((item) => (item.key === node.key ? { ...item, children } : item))
    ));
  };

  return (
    <Tree
      showLine
      onExpand={onExpand}
      switcherIcon={<DownOutlined />}
      loadData={onLoadData}
      treeData={treeData}
      defaultExpandParent={true}
    />
  );
}
