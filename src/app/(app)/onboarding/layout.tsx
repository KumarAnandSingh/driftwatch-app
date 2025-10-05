import { Suspense } from 'react';

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
        {children}
      </Suspense>
    </div>
  );
}
