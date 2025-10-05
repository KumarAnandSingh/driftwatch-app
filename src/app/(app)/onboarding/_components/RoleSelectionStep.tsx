'use client';

import { motion } from 'framer-motion';
import { Code, Palette, BarChart, Bug, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useState } from 'react';

interface RoleSelectionStepProps {
  onNext: (role: string) => void;
  onBack: () => void;
}

const roles = [
  {
    id: 'developer',
    title: 'Developer',
    description: 'I build web applications and care about code quality',
    icon: Code,
  },
  {
    id: 'designer',
    title: 'Designer',
    description: 'I design user experiences and interfaces',
    icon: Palette,
  },
  {
    id: 'product-manager',
    title: 'Product Manager',
    description: 'I manage products and oversee development',
    icon: BarChart,
  },
  {
    id: 'qa-engineer',
    title: 'QA Engineer',
    description: 'I test applications and ensure quality',
    icon: Bug,
  },
];

export function RoleSelectionStep({ onNext, onBack }: RoleSelectionStepProps) {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">What's your role?</h2>
        <p className="text-muted-foreground">
          This helps us personalize your experience
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
        {roles.map((role) => {
          const Icon = role.icon;
          const isSelected = selectedRole === role.id;

          return (
            <Card
              key={role.id}
              className={`p-6 cursor-pointer transition-all hover:border-primary ${
                isSelected ? 'border-primary border-2 bg-primary/5' : 'border-2'
              }`}
              onClick={() => setSelectedRole(role.id)}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                    isSelected
                      ? 'bg-primary text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{role.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {role.description}
                  </p>
                </div>
                {isSelected && (
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-between max-w-3xl mx-auto">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={() => selectedRole && onNext(selectedRole)}
          disabled={!selectedRole}
        >
          Continue
        </Button>
      </div>
    </motion.div>
  );
}
