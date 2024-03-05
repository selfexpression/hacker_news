import axios from 'axios';

import { getStories, getCurrentStory, getCommentsById } from '@/app/lib/data';
import { hackerNewsApi } from '@/utils/routes';
import { Story, Comment } from '@/types/definitions';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('getStories', () => {
  beforeEach(() => {
    mockedAxios.get.mockReset();
  });

  it('fetches stories successfully', async () => {
    const storyIds = [1, 2, 3];
    const stories: Story[] = [
      {
        id: 1,
        by: 'User 1',
        descendants: 10,
        score: 100,
        time: 111111,
        title: 'Story 1',
        type: 'story',
        url: 'http://example.com/1',
      },
      {
        id: 2,
        by: 'User 2',
        descendants: 20,
        score: 200,
        time: 222222,
        title: 'Story 2',
        type: 'story',
        url: 'http://example.com/2',
      },
      {
        id: 3,
        by: 'User 3',
        descendants: 30,
        score: 300,
        time: 333333,
        title: 'Story 3',
        type: 'story',
        url: 'http://example.com/3',
      },
    ];

    mockedAxios.get.mockImplementation((url) => {
      if (url === hackerNewsApi.newStories()) {
        return Promise.resolve({ data: storyIds });
      }
      const id = parseInt(url.match(/(\d+).json/)![1], 10);
      return Promise.resolve({ data: stories.find((story) => story.id === id) });
    });

    const result = await getStories();

    expect(result).toEqual(stories);
    expect(mockedAxios.get).toHaveBeenCalledTimes(4);
  });

  it('handles an error', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Network error'));

    await expect(getStories()).rejects.toThrow('Network error');

    expect(mockedAxios.get).toHaveBeenCalled();
  });
});

describe('getCurrentStory', () => {
  beforeEach(() => {
    mockedAxios.get.mockReset();
  });

  it('fetches current story successfully', async () => {
    const storyId = 1;
    const storyData: Story = {
      id: storyId,
      by: 'User 1',
      descendants: 10,
      score: 100,
      time: 111111,
      title: 'Story 1',
      type: 'story',
      url: 'http://example.com/1',
    };

    mockedAxios.get.mockResolvedValueOnce({ data: storyData });

    const result = await getCurrentStory(storyId);
    expect(result).toEqual(storyData);
    expect(mockedAxios.get).toHaveBeenCalledWith(hackerNewsApi.currentItem(storyId));
  });

  it('handles an error when fetching current story', async () => {
    const storyId = 1;
    mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

    await expect(getCurrentStory(storyId)).rejects.toThrow('Network error');
    expect(mockedAxios.get).toHaveBeenCalledWith(hackerNewsApi.currentItem(storyId));
  });
});

describe('getCommentsById', () => {
  beforeEach(() => {
    mockedAxios.get.mockReset();
  });

  it('fetches comments successfully', async () => {
    const commentIds = [1, 2];
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

    mockedAxios.get.mockImplementation((url) => {
      const id = parseInt(url.match(/(\d+).json/)![1], 10);
      return Promise.resolve({ data: comments.find((comment) => comment.id === id) });
    });

    const result = await getCommentsById(commentIds);

    expect(result).toEqual(comments);
    expect(mockedAxios.get).toHaveBeenCalledTimes(commentIds.length);
  });

  it('handles an error', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Network error'));

    await expect(getCommentsById([1])).rejects.toThrow('Network error');

    expect(mockedAxios.get).toHaveBeenCalled();
  });
});
