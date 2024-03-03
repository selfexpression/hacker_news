import type { Metadata } from 'next';

import { inter } from '@/app/ui/fonts';

export const metadata: Metadata = {
  // metadataBase: new URL(''),
  title: {
    template: '%s | Hacker News',
    default: 'Hacker News',
  },
  description: 'News portal with reports about the IT world',
  keywords: ['news', 'IT news', 'hacker'],
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
