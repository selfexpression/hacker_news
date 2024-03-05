import React from 'react';
import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/router';

import NavLink from '@/app/ui/stories/nav-link';
import '@testing-library/jest-dom';
import { pageRoutes } from '@/utils/routes';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('NavLink', () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });

    pushMock.mockReset();
  });

  it('renders the home link with correct href', () => {
    render(<NavLink />);
    const homeLink = screen.getByText('To Home Page').closest('a');
    expect(homeLink).toHaveAttribute('href', pageRoutes.home());
  });

  it('displays the correct icon', () => {
    render(<NavLink />);
    const icon = screen.getByLabelText('home');
    expect(icon).toBeInTheDocument();
  });
});
