'use client';

import { useState, useEffect } from 'react';
import { Tree } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import type { EventDataNode } from 'antd/es/tree';
import type { Key } from 'antd/es/table/interface';

import type { Comment, TreeNode } from '@/types/definitions';
import { getCommentsById } from '@/app/lib/data';
import { generateTreeData, updateTreeData } from '@/utils/helpers';

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
