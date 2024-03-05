import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import StoryHeader from '@/app/ui/stories/story-header';
import { useStory } from '@/app/hooks';
import { generateDate } from '@/utils/helpers';

jest.mock('@/app/hooks');
jest.mock('@/utils/helpers');

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

describe('StoryHeader', () => {
  const story = {
    id: '123',
    by: 'Author',
    time: 1600000000,
    title: 'Test Story',
    url: 'http://example.com',
    descendants: 10,
    score: 5,
    type: 'story',
  };

  beforeEach(() => {
    (useStory as jest.Mock).mockReturnValue({ story: null });
    (generateDate as jest.Mock).mockReturnValue('Some Date');
  });

  it('displays the story details correctly', () => {
    render(<StoryHeader story={story} />);

    expect(screen.getByText('Test Story')).toHaveAttribute('href', story.url);
    expect(screen.getByText(/Author: Author/)).toBeInTheDocument();
    expect(screen.getByText(/Some Date/i)).toBeInTheDocument();
    expect(screen.getByText('Comments: 10')).toBeInTheDocument();
  });

  it('uses context story for comments count if available', () => {
    (useStory as jest.Mock).mockReturnValue({ story: { ...story, descendants: 20 } });
    render(<StoryHeader story={story} />);

    expect(screen.getByText('Comments: 20')).toBeInTheDocument();
  });
});
