'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  Globe,
  Camera,
  Accessibility,
  Zap,
  Eye,
  Brain,
  Clock,
} from 'lucide-react';

import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface RunStatus {
  id: string;
  status: 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  progress: number;
  currentPhase: string;
  pagesScanned?: number;
  issuesCritical?: number;
  issuesWarning?: number;
  issuesPassed?: number;
  score?: number;
  startedAt: string;
  finishedAt?: string;
}

interface PhaseInfo {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  color: string;
}

const phases: PhaseInfo[] = [
  {
    id: 'crawling',
    name: 'Crawling Pages',
    icon: Globe,
    description: 'Discovering and mapping your website structure',
    color: 'text-blue-500',
  },
  {
    id: 'screenshots',
    name: 'Capturing Screenshots',
    icon: Camera,
    description: 'Taking full-page screenshots of each page',
    color: 'text-purple-500',
  },
  {
    id: 'accessibility',
    name: 'Accessibility Scan',
    icon: Accessibility,
    description: 'Checking WCAG 2.1 compliance and violations',
    color: 'text-green-500',
  },
  {
    id: 'performance',
    name: 'Performance Analysis',
    icon: Zap,
    description: 'Measuring Core Web Vitals with Lighthouse',
    color: 'text-yellow-500',
  },
  {
    id: 'visual',
    name: 'Visual Regression',
    icon: Eye,
    description: 'Comparing screenshots for visual changes',
    color: 'text-pink-500',
  },
  {
    id: 'ai_critique',
    name: 'AI Design Critique',
    icon: Brain,
    description: 'Analyzing design quality with Claude AI',
    color: 'text-indigo-500',
  },
  {
    id: 'complete',
    name: 'Finalizing Report',
    icon: CheckCircle2,
    description: 'Generating comprehensive quality report',
    color: 'text-emerald-500',
  },
];

export default function ScanProgressPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.projectId as string;
  const runId = params.runId as string;

  const [runStatus, setRunStatus] = useState<RunStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [startTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);

  // Poll for status updates
  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchStatus = async () => {
      try {
        const response = await fetch(
          `/api/projects/${projectId}/runs/${runId}/status`
        );

        if (!response.ok) throw new Error('Failed to fetch status');

        const data = await response.json();
        setRunStatus(data);

        // If completed, trigger celebration and redirect
        if (data.status === 'COMPLETED') {
          clearInterval(interval);

          // Celebration based on score
          if (data.score >= 90) {
            confetti({
              particleCount: 150,
              spread: 80,
              origin: { y: 0.6 },
              colors: ['#10b981', '#34d399', '#6ee7b7'],
            });
          } else if (data.score >= 70) {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
            });
          }

          // Redirect to results after 2 seconds
          setTimeout(() => {
            router.push(`/projects/${projectId}/runs/${runId}/results`);
          }, 2000);
        }

        if (data.status === 'FAILED') {
          clearInterval(interval);
          setError('Scan failed. Please try again.');
        }
      } catch (err) {
        console.error('Error fetching status:', err);
        setError('Failed to fetch scan status');
      }
    };

    // Initial fetch
    fetchStatus();

    // Poll every second
    interval = setInterval(fetchStatus, 1000);

    return () => clearInterval(interval);
  }, [projectId, runId, router]);

  // Update elapsed time
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentPhaseIndex = (): number => {
    if (!runStatus?.currentPhase) return 0;
    return phases.findIndex((p) => p.id === runStatus.currentPhase) || 0;
  };

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-destructive">
              <AlertCircle className="h-6 w-6" />
              <div>
                <h3 className="font-semibold">Scan Failed</h3>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
            </div>
            <Button
              onClick={() => router.push(`/projects/${projectId}`)}
              className="mt-4"
            >
              Back to Project
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!runStatus) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p>Loading scan status...</p>
        </div>
      </div>
    );
  }

  const currentPhaseIndex = getCurrentPhaseIndex();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-2">
            {runStatus.status === 'COMPLETED'
              ? '✨ Scan Complete!'
              : runStatus.status === 'RUNNING'
              ? '🔍 Scanning Your Website...'
              : '⏳ Preparing Scan...'}
          </h1>
          <p className="text-muted-foreground">
            {runStatus.status === 'COMPLETED'
              ? 'Your quality report is ready! Redirecting...'
              : 'Please wait while we analyze your site'}
          </p>
        </motion.div>
      </div>

      {/* Overall Progress */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Overall Progress</span>
                <span className="text-muted-foreground">
                  {runStatus.progress}%
                </span>
              </div>

              <Progress value={runStatus.progress} className="h-3" />

              <div className="grid grid-cols-3 gap-4 text-center text-sm pt-2">
                <div>
                  <div className="font-mono font-semibold text-lg">
                    {runStatus.pagesScanned || 0}
                  </div>
                  <div className="text-muted-foreground">Pages Scanned</div>
                </div>
                <div>
                  <div className="font-mono font-semibold text-lg">
                    {formatTime(elapsedTime)}
                  </div>
                  <div className="text-muted-foreground">Elapsed Time</div>
                </div>
                <div>
                  <div className="font-mono font-semibold text-lg">
                    {runStatus.issuesCritical + runStatus.issuesWarning || 0}
                  </div>
                  <div className="text-muted-foreground">Issues Found</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Phase Progress */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {phases.map((phase, index) => {
            const isActive = index === currentPhaseIndex;
            const isComplete = index < currentPhaseIndex;
            const isUpcoming = index > currentPhaseIndex;

            const Icon = phase.icon;

            return (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card
                  className={`transition-all ${
                    isActive
                      ? 'border-primary shadow-lg'
                      : isComplete
                      ? 'border-green-500/50 bg-green-50/50 dark:bg-green-950/20'
                      : 'border-muted'
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      {/* Icon */}
                      <div
                        className={`flex-shrink-0 ${
                          isActive
                            ? 'animate-pulse'
                            : ''
                        }`}
                      >
                        {isActive ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: 'linear',
                            }}
                          >
                            <Icon className={`h-8 w-8 ${phase.color}`} />
                          </motion.div>
                        ) : isComplete ? (
                          <CheckCircle2 className="h-8 w-8 text-green-600" />
                        ) : (
                          <Icon className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{phase.name}</h3>
                          {isActive && (
                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                          )}
                          {isComplete && (
                            <span className="text-xs text-green-600 font-medium">
                              ✓ Complete
                            </span>
                          )}
                          {isUpcoming && (
                            <span className="text-xs text-muted-foreground">
                              Waiting...
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-sm ${
                            isActive
                              ? 'text-foreground'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {phase.description}
                        </p>

                        {/* Phase-specific details */}
                        {isActive && phase.id === 'accessibility' && runStatus.issuesCritical !== undefined && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-2 text-xs text-muted-foreground"
                          >
                            Found: {runStatus.issuesCritical} critical, {runStatus.issuesWarning} warnings, {runStatus.issuesPassed} passed
                          </motion.div>
                        )}
                      </div>

                      {/* Status Indicator */}
                      <div className="flex-shrink-0">
                        {isActive && (
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              ease: 'easeInOut',
                            }}
                            className="h-3 w-3 rounded-full bg-primary"
                          />
                        )}
                        {isComplete && (
                          <div className="h-3 w-3 rounded-full bg-green-600" />
                        )}
                        {isUpcoming && (
                          <div className="h-3 w-3 rounded-full bg-muted" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Live Stats (if available) */}
      {runStatus.score !== undefined && runStatus.score !== null && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-2">
                  Current Score
                </div>
                <div className="text-5xl font-bold text-primary">
                  {runStatus.score}
                  <span className="text-2xl text-muted-foreground">/100</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Cancel Button */}
      {runStatus.status === 'RUNNING' && (
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            onClick={() => router.push(`/projects/${projectId}`)}
          >
            Return to Dashboard
          </Button>
        </div>
      )}
    </div>
  );
}
