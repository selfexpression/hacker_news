'use server';

import { Metadata } from 'next';

import { getCurrentStory } from '@/app/lib/data';

type Params = {
  params: { id: string };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = params;
  const data = await getCurrentStory(id);

  return {
    title: data.title,
  };
}

export default async function Story({ params }: Params): Promise<JSX.Element> {
  const { id } = params;
  const data = await getCurrentStory(id);

  return (
    <article>
      <h1>{data.title}</h1>
    </article>
  );
}
