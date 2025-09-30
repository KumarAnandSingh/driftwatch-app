'use client';

import { motion } from 'motion/react';

interface ProgressShimmerProps {
  value: number;
  max?: number;
  animated?: boolean;
  className?: string;
}

export function ProgressShimmer({
  value,
  max = 100,
  animated = true,
  className = '',
}: ProgressShimmerProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={`relative w-full h-2 bg-secondary rounded-full overflow-hidden ${className}`}>
      {/* Progress Bar */}
      <motion.div
        className="h-full bg-primary rounded-full relative overflow-hidden"
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Shimmer Effect */}
        {animated && percentage < 100 && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        )}
      </motion.div>
    </div>
  );
}
