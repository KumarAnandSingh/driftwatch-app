import React from 'react';
import { SessionProvider } from '@/components/SessionProvider';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}
