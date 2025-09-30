import React from 'react';
import { SessionProvider } from '@/components/SessionProvider';
import { AppHeader } from '@/components/AppHeader';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-background">
        <AppHeader currentPath="/dashboard" />
        <main>{children}</main>
      </div>
    </SessionProvider>
  );
}
