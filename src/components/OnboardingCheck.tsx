'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export function OnboardingCheck() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Skip check if already on onboarding page
    if (pathname.startsWith('/onboarding')) {
      return;
    }

    // Check onboarding status
    async function checkOnboarding() {
      try {
        const response = await fetch('/api/onboarding');
        if (response.ok) {
          const data = await response.json();

          // Redirect to onboarding if not completed
          if (!data.onboardingCompleted) {
            router.push('/onboarding');
          }
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      }
    }

    checkOnboarding();
  }, [pathname, router]);

  return null;
}
