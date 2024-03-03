'use client';

import { useState, useEffect } from 'react';
import { Tree } from 'antd';
import { Key } from 'antd/lib/table/interface';
import { DownOutlined } from '@ant-design/icons';

import type { Comment, TreeData } from '@/types/definitions';
import { generateTreeData } from '@/utils/helpers';

export default function StoryComments({ comments }: { comments: Comment[] }) {
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [treeData, setTreeData] = useState<TreeData[]>([]);

  useEffect(() => {
    const loadTreeData = async () => {
      const data = await generateTreeData(comments);
      setTreeData(data);
    };

    loadTreeData();
  }, [comments]);

  const onExpand = (expandedKeysValue: Key[]) => {
    setExpandedKeys(expandedKeysValue as string[]);
  };

  return (
    <Tree
      showLine
      onExpand={onExpand}
      switcherIcon={<DownOutlined />}
      expandedKeys={expandedKeys}
      treeData={treeData}
      defaultExpandParent={true}
    />
  );
}
