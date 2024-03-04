export const hackerNewsApi = {
  newStories: (): string => 'https://hacker-news.firebaseio.com/v0/newstories.json',
  currentItem: (id: number | string): string => `https://hacker-news.firebaseio.com/v0/item/${id}.json`,
};

export const pageRoutes = {
  home: () => '/',
  stories: (id: number): string => `/stories/${id}`,
};
