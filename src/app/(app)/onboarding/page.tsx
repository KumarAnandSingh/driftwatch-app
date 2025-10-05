'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { ProgressBar } from './_components/ProgressBar';
import { WelcomeStep } from './_components/WelcomeStep';
import { RoleSelectionStep } from './_components/RoleSelectionStep';
import { CreateProjectStep } from './_components/CreateProjectStep';
import { SuccessStep } from './_components/SuccessStep';

const TOTAL_STEPS = 4;

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [role, setRole] = useState<string | null>(null);
  const [projectData, setProjectData] = useState<{ name: string; url: string } | null>(null);

  const handleRoleSelect = async (selectedRole: string) => {
    setRole(selectedRole);

    // Update user role via API
    await fetch('/api/onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        role: selectedRole,
        step: 2
      }),
    });

    setCurrentStep(3);
  };

  const handleProjectCreate = async (data: { name: string; url: string }) => {
    setProjectData(data);

    // Create project via API
    await fetch('/api/onboarding/create-project', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    // Update onboarding step
    await fetch('/api/onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ step: 3 }),
    });

    setCurrentStep(4);
  };

  const handleSkip = async () => {
    // Mark onboarding as skipped
    await fetch('/api/onboarding/skip', {
      method: 'POST',
    });

    router.push('/dashboard');
  };

  const handleComplete = async () => {
    // Mark onboarding as completed
    await fetch('/api/onboarding/complete', {
      method: 'POST',
    });

    if (projectData) {
      // Redirect to first scan if project was created
      router.push('/dashboard');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen flex flex-col justify-center">
      {currentStep < 4 && <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />}

      <AnimatePresence mode="wait">
        {currentStep === 1 && (
          <WelcomeStep key="welcome" onNext={() => setCurrentStep(2)} />
        )}

        {currentStep === 2 && (
          <RoleSelectionStep
            key="role"
            onNext={handleRoleSelect}
            onBack={() => setCurrentStep(1)}
          />
        )}

        {currentStep === 3 && (
          <CreateProjectStep
            key="project"
            onNext={handleProjectCreate}
            onBack={() => setCurrentStep(2)}
            onSkip={handleSkip}
          />
        )}

        {currentStep === 4 && (
          <SuccessStep
            key="success"
            onComplete={handleComplete}
            projectName={projectData?.name}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
