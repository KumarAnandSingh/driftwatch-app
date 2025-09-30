import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DriftWatch - Unified Quality Report for Your Web App',
  description: 'Test flows, accessibility, performance, visual regression, and get AI design critique in one offline report.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}