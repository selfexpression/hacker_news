import React from 'react';
import {
  render, screen, fireEvent, act, waitFor,
} from '@testing-library/react';

import '@testing-library/jest-dom';

import { RefreshButton } from '@/app/ui/stories/story-comments';
import { useStory } from '@/app/hooks';
import { getCurrentStory, getCommentsById } from '@/app/lib/data';
import { generateNestedTreeData } from '@/utils/helpers';
import type { Comment, Story } from '@/types/definitions';

jest.mock('@/app/hooks');
jest.mock('@/utils/routes');
jest.mock('@/utils/helpers');
jest.mock('@/app/lib/data');

const storyId = '0';

const story: Story = {
  id: storyId,
  by: 'author',
  descendants: 10,
  kids: [3, 4],
  score: 100,
  time: 1600000000,
  title: 'Test Story',
  type: 'story',
  url: 'http://example.com',
};

const comments: Comment[] = [
  {
    by: 'User 1',
    id: 1,
    parent: 0,
    text: 'Comment 1',
    time: 111111,
    type: 'comment',
  },
  {
    by: 'User 2',
    id: 2,
    parent: 0,
    text: 'Comment 2',
    time: 222222,
    type: 'comment',
  },
];

describe('RefreshButton', () => {
  const setTreeData = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useStory as jest.Mock).mockReturnValue({ setStory: jest.fn() });
    (getCurrentStory as jest.Mock).mockResolvedValue({ ...story, kids: [3, 4] });
    (getCommentsById as jest.Mock).mockResolvedValue(comments);
    (generateNestedTreeData as jest.Mock).mockResolvedValue(comments);
  });

  it('calls the correct functions to refresh comments on click', async () => {
    render(<RefreshButton setTreeData={setTreeData} storyId={storyId} />);

    const button = screen.getByRole('button', { name: /refresh comments/i });

    await act(async () => {
      fireEvent.click(button);
    });

    expect(getCurrentStory).toHaveBeenCalledWith(storyId);
    expect(getCommentsById).toHaveBeenCalledWith([3, 4]);
    await waitFor(() => {
      expect(generateNestedTreeData).toHaveBeenCalledWith(comments);
      expect(setTreeData).toHaveBeenCalledWith(comments);
    });
  });
});
