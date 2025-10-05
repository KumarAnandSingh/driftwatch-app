'use client';

import { motion } from 'framer-motion';
import { PartyPopper, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface SuccessStepProps {
  onComplete: () => void;
  projectName?: string;
}

export function SuccessStep({ onComplete, projectName }: SuccessStepProps) {
  useEffect(() => {
    // Fire confetti on mount
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#a855f7', '#3b82f6', '#8b5cf6'],
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#a855f7', '#3b82f6', '#8b5cf6'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center space-y-8"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="space-y-4"
      >
        <div className="h-24 w-24 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center mx-auto">
          <PartyPopper className="h-12 w-12 text-white" />
        </div>
        <h1 className="text-4xl font-bold">You're all set! 🎉</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {projectName
            ? `Your project "${projectName}" is ready to go. Let's run your first quality scan!`
            : "Your account is ready to go. Let's get started with DriftWatch!"}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-4 max-w-md mx-auto"
      >
        <div className="grid gap-3 text-left p-6 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-primary flex-shrink-0" />
            <p className="text-sm">Scan for accessibility issues</p>
          </div>
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-primary flex-shrink-0" />
            <p className="text-sm">Monitor performance metrics</p>
          </div>
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-primary flex-shrink-0" />
            <p className="text-sm">Get AI-powered design feedback</p>
          </div>
        </div>

        <Button size="lg" onClick={onComplete} className="w-full gap-2">
          {projectName ? 'Run Your First Scan' : 'Go to Dashboard'}
          <ArrowRight className="h-5 w-5" />
        </Button>
      </motion.div>
    </motion.div>
  );
}
