import React from 'react';
import { SessionProvider } from '@/components/SessionProvider';
import { MarketingHeader } from '@/components/MarketingHeader';
import { Footer } from '@/components/Footer';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="flex min-h-screen flex-col">
        <MarketingHeader />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </SessionProvider>
  );
}
