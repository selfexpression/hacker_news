'use client';

import {
  useState, useEffect, SetStateAction, Dispatch,
} from 'react';
import { Tree, Divider, Button } from 'antd';
import type { EventDataNode } from 'antd/es/tree';
import type { Key } from 'antd/es/table/interface';

import type { Comment, TreeNode } from '@/types/definitions';
import { getCommentsById, getCurrentStory } from '@/app/lib/data';
import { generateTreeData, updateTreeData, generateNestedTreeData } from '@/utils/helpers';
import { useStory } from '@/app/hooks';

function RefreshButton(
  {
    setTreeData,
    storyId,
  }: { setTreeData: Dispatch<SetStateAction<TreeNode[]>>, storyId: string},
): JSX.Element {
  const { setStory } = useStory();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshComments = async (): Promise<void> => {
    setIsRefreshing(true);
    const updatedStory = await getCurrentStory(storyId);
    const newComments = updatedStory.kids ? await getCommentsById(updatedStory.kids) : [];
    setTreeData(await generateNestedTreeData(newComments));
    setStory(updatedStory);
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

  const onLoadData = async (node: TreeNode): Promise<TreeNode[]> => {
    if (node.isLeaf || node.loaded) {
      return node.children || [];
    }

    const childKeys = node.children?.map(({ key }) => key) || [];
    const childComments = await getCommentsById(childKeys);
    return generateTreeData(childComments);
  };

  const onExpand = async (
    expandedKeys: Key[],
    { node, expanded }: { node: EventDataNode<TreeNode>, expanded: boolean },
  ): Promise<void> => {
    setCurrentExpandedKeys(expandedKeys);

    if (expanded && !node.loaded) {
      const childNodes = await onLoadData(node);
      setTreeData((current) => updateTreeData(current, node.key, childNodes));
    }
  };

  return (
    <div style={{ marginTop: 30 }}>
      <RefreshButton setTreeData={setTreeData} storyId={storyId} />
      <Tree
        showLine
        showIcon
        loadData={onLoadData}
        expandedKeys={currentExpandedKeys}
        onExpand={onExpand}
        treeData={treeData}
        defaultExpandParent
      />
    </div>
  );
}
