'use client';

import { motion } from 'framer-motion';
import { Sparkles, Zap, Eye, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface WelcomeStepProps {
  onNext: () => void;
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="text-center space-y-8"
    >
      <div className="space-y-4">
        <div className="h-20 w-20 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center mx-auto">
          <Sparkles className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold">Welcome to DriftWatch! 👋</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Let's get you started in 3 easy steps. We'll help you set up your first project and run your first quality scan.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <Card className="p-6 text-center border-2 hover:border-primary transition-colors">
          <Eye className="h-10 w-10 text-primary mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Visual Regression</h3>
          <p className="text-sm text-muted-foreground">
            Catch visual changes before your users do
          </p>
        </Card>

        <Card className="p-6 text-center border-2 hover:border-primary transition-colors">
          <AlertTriangle className="h-10 w-10 text-primary mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Accessibility</h3>
          <p className="text-sm text-muted-foreground">
            Ensure your app is accessible to everyone
          </p>
        </Card>

        <Card className="p-6 text-center border-2 hover:border-primary transition-colors">
          <Zap className="h-10 w-10 text-primary mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Performance</h3>
          <p className="text-sm text-muted-foreground">
            Monitor Core Web Vitals and speed
          </p>
        </Card>
      </div>

      <Button size="lg" onClick={onNext} className="gap-2">
        Get Started
        <Sparkles className="h-5 w-5" />
      </Button>
    </motion.div>
  );
}
