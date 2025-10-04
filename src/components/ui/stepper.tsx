'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: string;
  name: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <nav aria-label="Progress">
      <ol className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li
            key={step.id}
            className={cn(
              stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : '',
              'relative'
            )}
          >
            {currentStep > stepIdx ? (
              <>
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="h-0.5 w-full bg-primary" />
                </div>
                <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                  <Check className="h-5 w-5 text-primary-foreground" />
                  <span className="sr-only">{step.name}</span>
                </div>
              </>
            ) : currentStep === stepIdx ? (
              <>
                {stepIdx !== 0 && (
                  <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <div className="h-0.5 w-full bg-muted" />
                  </div>
                )}
                <div
                  className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-background"
                  aria-current="step"
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                  <span className="sr-only">{step.name}</span>
                </div>
              </>
            ) : (
              <>
                {stepIdx !== 0 && (
                  <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <div className="h-0.5 w-full bg-muted" />
                  </div>
                )}
                <div className="group relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-muted bg-background">
                  <span className="h-2.5 w-2.5 rounded-full bg-muted" />
                  <span className="sr-only">{step.name}</span>
                </div>
              </>
            )}
            <div className="mt-2">
              <span className="text-xs font-medium text-muted-foreground">
                {step.name}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
