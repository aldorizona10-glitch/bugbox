import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BugBox — a bug tracker hardened by the loop',
  description:
    'A small bug tracker whose regressions are caught by the TestSprite verify loop. Built for TestSprite Hackathon Season 3.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
