'use server';

import { Metadata } from 'next';

import { getCurrentStory, getCommentsById } from '@/app/lib/data';
import StoryHeader from '@/app/ui/stories/story-header';
import StoryComments from '@/app/ui/stories/story-comments';
import { StoryProvider } from '@/app/context/StoryContext';

type Params = {
  params: { id: string };
}

export async function generateMetadata(
  { params }: Params,
): Promise<Metadata> {
  const { id } = params;
  const story = await getCurrentStory(id);

  return {
    title: story.title,
  };
}

export default async function Story(
  { params }: Params,
): Promise<JSX.Element> {
  const { id } = params;
  const story = await getCurrentStory(id);
  const comments = story.kids ? await getCommentsById(story.kids) : [];

  return (
    <article>
      <StoryProvider>
        <StoryHeader story={story} />
        <StoryComments comments={comments} storyId={id} />
      </StoryProvider>
    </article>
  );
}
