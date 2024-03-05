'use server';

import StoriesList from './ui/stories-list';
import { getStories } from './lib/data';

export default async function HomePage():Promise<JSX.Element> {
  const initialStories = await getStories();

  return (
    <main style={{ padding: '0 10px 10px' }}>
      <StoriesList initialStories={initialStories} />
    </main>
  );
}
