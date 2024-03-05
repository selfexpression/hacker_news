import { FileOutlined } from '@ant-design/icons';

import { generateTreeData, generateNestedTreeData, updateTreeData } from '@/utils/helpers';
import { getCommentsById } from '@/app/lib/data';
import { TreeNode, Comment } from '@/types/definitions';

const mockedGetCommentsById = getCommentsById as jest.Mock;

jest.mock('@/app/lib/data', () => ({
  getCommentsById: jest.fn(),
}));

describe('generateTreeData', () => {
  it('correctly transforms an empty array', () => {
    expect(generateTreeData([])).toEqual([]);
  });

  it('correctly handles comments without children', () => {
    const comments: Comment[] = [{
      id: 1,
      text: 'Test comment',
      kids: [],
      by: 'user',
      parent: 0,
      time: Date.now(),
      type: 'comment',
    }];

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
    const comments: Comment[] = [{
      id: 1,
      text: 'Parent comment',
      kids: [2],
      by: 'user',
      parent: 0,
      time: Date.now(),
      type: 'comment',
    }];

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

describe('generateNestedTreeData', () => {
  beforeEach(() => {
    (getCommentsById as jest.Mock).mockReset();
  });

  it('should convert flat comments to a nested tree structure', async () => {
    const comments: Comment[] = [{
      id: 1,
      text: 'Parent comment',
      kids: [2],
      by: 'user',
      parent: 0,
      time: Date.now(),
      type: 'comment',
    }];

    const childComments: Comment[] = [{
      id: 2,
      text: 'Child comment',
      kids: [],
      by: 'user',
      parent: 1,
      time: Date.now(),
      type: 'comment',
    }];

    mockedGetCommentsById.mockResolvedValueOnce(childComments);
    const expectedTree: TreeNode[] = [{
      key: '1',
      title: 'Parent comment',
      isLeaf: false,
      icon: false,
      children: [{
        key: '2',
        title: 'Child comment',
        isLeaf: true,
        icon: <FileOutlined />,
        children: [],
      }],
    }];

    const tree = await generateNestedTreeData(comments);
    expect(tree).toEqual(expectedTree);
  });
});

describe('updateTreeData', () => {
  it('updates the node with the specified key at the top level', () => {
    const list: TreeNode[] = [{
      key: '1',
      title: 'Node 1',
      isLeaf: false,
      icon: false,
      children: [],
    }, {
      key: '2',
      title: 'Node 2',
      isLeaf: false,
      icon: false,
      children: [],
    }];
    const newChildren: TreeNode[] = [{
      key: '3',
      title: 'Node 3',
      isLeaf: true,
      icon: false,
      children: [],
    }];

    const updatedList = updateTreeData(list, '2', newChildren);

    expect(updatedList).toEqual([{
      key: '1',
      title: 'Node 1',
      isLeaf: false,
      icon: false,
      children: [],
    }, {
      key: '2',
      title: 'Node 2',
      isLeaf: false,
      icon: false,
      children: newChildren,
      loaded: true,
    }]);
  });

  it('updates the node with the specified key at a nested level', () => {
    const list: TreeNode[] = [{
      key: '1',
      title: 'Node 1',
      isLeaf: false,
      icon: false,
      children: [{
        key: '2',
        title: 'Node 2',
        isLeaf: false,
        icon: false,
        children: [],
      }],
    }];

    const newChildren: TreeNode[] = [{
      key: '3',
      title: 'Node 3',
      isLeaf: true,
      icon: false,
      children: [],
    }];

    const updatedList = updateTreeData(list, '2', newChildren);
    expect(updatedList).toEqual([{
      key: '1',
      title: 'Node 1',
      isLeaf: false,
      icon: false,
      children: [{
        key: '2',
        title: 'Node 2',
        isLeaf: false,
        icon: false,
        children: newChildren,
        loaded: true,
      }],
    }]);
  });
});
