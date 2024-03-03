import axios from 'axios';
import { unstable_noStore as noStore } from 'next/cache';

import { Story, Comment } from '@/types/definitions';
import { hackerNewsApi } from '@/utils/routes';

export async function getStories(): Promise<Story[]> {
  noStore();
  try {
    const { data } = await axios.get(hackerNewsApi.newStories());

    const stories = await Promise.all(data.slice(0, 100)
      .map(async (id: number) => {
        const storyRes = await axios.get(hackerNewsApi.currentItem(id));
        return storyRes.data;
      }));

    return stories;
  } catch (error) {
    console.error('Error fetching stories:', error);
    throw error;
  }
}

export async function getCurrentStory(id: string | number): Promise<Story> {
  noStore();
  try {
    const { data } = await axios.get(hackerNewsApi.currentItem(id));
    return data;
  } catch (error) {
    console.error('Error fetching current story:', error);
    throw error;
  }
}

export async function getCommentsById(ids: number[]): Promise<Comment[]> {
  noStore();
  try {
    const comments = await Promise.all(ids.map((commentId) => (
      axios.get(hackerNewsApi.currentItem(commentId))
        .then((response) => response.data)
    )));

    return comments;
  } catch (error) {
    console.error('Error fetching current comments:', error);
    throw error;
  }
}
