import {
  render, screen, fireEvent, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';

import StoriesList, { StoriesListHeader, StoryItem } from '@/app/ui/stories-list';
import { getStories } from '@/app/lib/data';
import type { Story } from '@/types/definitions';

jest.mock('@/app/lib/data');

const story: Story = {
  id: 0,
  by: 'author',
  descendants: 10,
  kids: [3, 4],
  score: 100,
  time: 1600000000,
  title: 'Test Story',
  type: 'story',
  url: 'http://example.com',
};

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

describe('StoriesListHeader', () => {
  it('renders correctly and responds to refresh click', () => {
    const mockOnRefresh = jest.fn();
    render(<StoriesListHeader onRefresh={mockOnRefresh} isRefreshing={false} />);

    const refreshButton = screen.getByRole('button', { name: /Refresh News/i });
    fireEvent.click(refreshButton);

    expect(mockOnRefresh).toHaveBeenCalledTimes(1);
  });
});

describe('StoryItem', () => {
  it('renders story item correctly', () => {
    render(<StoryItem story={story} index={0} />);

    const title = screen.getByText(/1. Test Story/i);
    const description = screen.getByText(/Author: author \| Rating: 100 \| Date:/i);

    expect(title).toBeInTheDocument();
    expect(description).toBeInTheDocument();
  });
});

describe('StoriesList', () => {
  beforeEach(() => {
    (getStories as jest.Mock).mockResolvedValue([story]);
  });

  it('renders stories and allows manual refresh', async () => {
    render(<StoriesList initialStories={[]} />);

    expect(screen.getByText(/Hacker News/i)).toBeInTheDocument();

    const refreshButton = screen.getByRole('button', { name: /Refresh News/i });
    fireEvent.click(refreshButton);

    await waitFor(() => {
      expect(screen.getByText(/Test Story/i)).toBeInTheDocument();
    });
  });
});
