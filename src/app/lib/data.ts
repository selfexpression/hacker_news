import axios from 'axios';
import { unstable_noStore as noStore } from 'next/cache';

import { Story } from '@/types/definitions';
import { hackerNewsApi } from '@/utils/routes';

export default async function getStories(): Promise<Story[]> {
  noStore();
  try {
    const { data } = await axios.get(hackerNewsApi.newStories());

    const stories = await Promise.all(data.slice(0, 100)
      .map(async (id: number) => {
        const storyRes = await axios.get(hackerNewsApi.currentStory(id));
        return storyRes.data;
      }));

    return stories;
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}
