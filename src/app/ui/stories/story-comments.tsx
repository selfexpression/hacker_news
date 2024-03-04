'use client';

import {
  useState, useEffect, SetStateAction, Dispatch,
} from 'react';
import { Tree, Divider, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import type { EventDataNode } from 'antd/es/tree';
import type { Key } from 'antd/es/table/interface';

import type { Comment, TreeNode } from '@/types/definitions';
import { getCommentsById, getCurrentStory } from '@/app/lib/data';
import { generateTreeData, updateTreeData, generateNestedTreeData } from '@/utils/helpers';

function RefreshButton(
  {
    setTreeData,
    storyId,
  }: { setTreeData: Dispatch<SetStateAction<TreeNode[]>>, storyId: string},
): JSX.Element {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshComments = async () => {
    setIsRefreshing(true);
    const updatedStory = await getCurrentStory(storyId);
    const newComments = updatedStory.kids ? await getCommentsById(updatedStory.kids) : [];
    setTreeData(await generateNestedTreeData(newComments));
    setIsRefreshing(false);
  };

  return (
    <Divider orientation="left" plain>
      <Button
        type="primary"
        size="small"
        loading={isRefreshing}
        onClick={refreshComments}
      >
          Refresh comments
      </Button>
    </Divider>
  );
}

export default function StoryComments(
  {
    comments,
    storyId,
  }: { comments: Comment[], storyId: string },
): JSX.Element {
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [currentExpandedKeys, setCurrentExpandedKeys] = useState<Key[]>([]);

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
    setCurrentExpandedKeys(expandedKeys);

    if (expanded && !node.loaded) {
      const childNodes = await onLoadData(node);
      setTreeData((current) => updateTreeData(current, node.key, childNodes));
    }
  };

  return (
    <>
      <RefreshButton
        setTreeData={setTreeData}
        storyId={storyId}
      />
      <Tree
        showLine
        switcherIcon={<DownOutlined />}
        loadData={onLoadData}
        expandedKeys={currentExpandedKeys}
        onExpand={onExpand}
        treeData={treeData}
        defaultExpandParent
      />
    </>
  );
}
