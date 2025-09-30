'use client';

import { motion } from 'motion/react';

interface ScanHaloProps {
  active?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function ScanHalo({ active = false, children, className = '' }: ScanHaloProps) {
  if (!active) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={`relative ${className}`}>
      {/* Animated Halo */}
      <motion.div
        className="absolute -inset-1 rounded-xl opacity-75 blur-lg"
        style={{
          background: 'linear-gradient(45deg, hsl(var(--primary)), hsl(262 80% 60%), hsl(280 80% 50%), hsl(var(--primary)))',
          backgroundSize: '400% 400%',
        }}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Pulse Effect */}
      <motion.div
        className="absolute -inset-1 rounded-xl"
        style={{
          background: 'linear-gradient(45deg, hsl(var(--primary)), hsl(262 80% 60%), hsl(280 80% 50%))',
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Content */}
      <div className="relative">{children}</div>
    </div>
  );
}
