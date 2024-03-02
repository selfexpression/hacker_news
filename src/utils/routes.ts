export const hackerNewsApi = {
  newStories: (): string => 'https://hacker-news.firebaseio.com/v0/newstories.json',
  currentStory: (id: number): string => `https://hacker-news.firebaseio.com/v0/item/${id}.json`,
};
