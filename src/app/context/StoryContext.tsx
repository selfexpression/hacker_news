'use client';

import {
  ReactNode, createContext, useState, type Dispatch, type SetStateAction,
} from 'react';

import { Story } from '@/types/definitions';

interface StoryContextType {
  story: Story | undefined;
  setStory: Dispatch<SetStateAction<Story | undefined>>
}

const defaultContextValue: StoryContextType = {
  story: undefined,
  setStory: () => {},
};

export const StoryContext = createContext<StoryContextType>(defaultContextValue);

export const StoryProvider = ({ children }: { children: ReactNode }) => {
  const [story, setStory] = useState<Story>();

  return (
    <StoryContext.Provider value={{ story, setStory }}>
      {children}
    </StoryContext.Provider>
  );
};
