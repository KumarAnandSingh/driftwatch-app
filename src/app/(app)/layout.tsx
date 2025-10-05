import React from 'react';
import { SessionProvider } from '@/components/SessionProvider';
import { AppHeader } from '@/components/AppHeader';
import { OnboardingCheck } from '@/components/OnboardingCheck';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <OnboardingCheck />
      <div className="min-h-screen bg-background">
        <AppHeader currentPath="/dashboard" />
        <main>{children}</main>
      </div>
    </SessionProvider>
  );
}
