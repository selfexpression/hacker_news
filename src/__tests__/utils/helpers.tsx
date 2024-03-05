import { FileOutlined } from '@ant-design/icons';

import { generateTreeData } from '@/utils/helpers';
import { TreeNode, Comment } from '@/types/definitions';

describe('generateTreeData', () => {
  it('correctly transforms an empty array', () => {
    expect(generateTreeData([])).toEqual([]);
  });

  it('correctly handles comments without children', () => {
    const comments: Comment[] = [
      {
        id: 1,
        text: 'Test comment',
        kids: [],
        by: 'user',
        parent: 0,
        time: Date.now(),
        type: 'comment',
      },
    ];
    const expectedResult: TreeNode[] = [{
      key: '1',
      title: 'Test comment',
      isLeaf: true,
      icon: <FileOutlined />,
      children: [],
    }];

    expect(generateTreeData(comments)).toEqual(expectedResult);
  });

  it('correctly handles comments with children', () => {
    const comments: Comment[] = [
      {
        id: 1,
        text: 'Parent comment',
        kids: [2],
        by: 'user',
        parent: 0,
        time: Date.now(),
        type: 'comment',
      },
    ];
    const expectedResult: TreeNode[] = [{
      key: '1',
      title: 'Parent comment',
      isLeaf: false,
      icon: false,
      children: [{
        key: '2',
        title: 'Loading...',
        icon: <FileOutlined />,
        loaded: false,
      }],
    }];

    expect(generateTreeData(comments)).toEqual(expectedResult);
  });
});
