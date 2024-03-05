import React from 'react';
import {
  fireEvent, render, screen, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';

import StoryComments from '@/app/ui/stories/story-comments';
import { useStory } from '@/app/hooks';
import { getCurrentStory, getCommentsById } from '@/app/lib/data';
import type { Comment, Story } from '@/types/definitions';

jest.mock('@/app/hooks');
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

describe('StoryComments', () => {
  beforeEach(() => {
    (useStory as jest.Mock).mockReturnValue({ setStory: jest.fn() });

    (getCurrentStory as jest.Mock).mockResolvedValue(story);
    (getCommentsById as jest.Mock).mockResolvedValue(comments);

    jest.clearAllMocks();
  });

  it('renders the component and displays the initial comments', async () => {
    render(<StoryComments comments={comments} storyId={storyId} />);

    expect(screen.getByText('Comment 1')).toBeInTheDocument();
    expect(screen.getByText('Comment 2')).toBeInTheDocument();
  });

  it('refreshes comments when the refresh button is clicked', async () => {
    render(<StoryComments comments={comments} storyId={storyId} />);

    const refreshButton = screen.getByText('Refresh comments');

    fireEvent.click(refreshButton);

    await waitFor(() => {
      expect(getCurrentStory).toHaveBeenCalledWith(storyId);
    });

    await waitFor(() => {
      expect(getCommentsById).toHaveBeenCalledWith([3, 4]);
    });
  });
});
