'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/Button';
import { Container } from '@/components/Container';
import { Card } from '@/components/Card';

interface CategoryStatus {
  name: string;
  icon: string;
  status: 'pending' | 'running' | 'complete';
  progress: number;
  color: string;
}

export default function DemoPlayback() {
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [categories, setCategories] = useState<CategoryStatus[]>([
    { name: 'Flow Tests', icon: '🔄', status: 'pending', progress: 0, color: 'indigo' },
    { name: 'Accessibility', icon: '♿', status: 'pending', progress: 0, color: 'purple' },
    { name: 'Performance', icon: '⚡', status: 'pending', progress: 0, color: 'pink' },
    { name: 'Visual Regression', icon: '🖼️', status: 'pending', progress: 0, color: 'blue' },
    { name: 'AI Design Critique', icon: '🤖', status: 'pending', progress: 0, color: 'amber' },
  ]);

  useEffect(() => {
    if (!isPlaying) return;

    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          setIsPlaying(false);
          return 100;
        }
        return p + 1;
      });
    }, 120);

    return () => clearInterval(id);
  }, [isPlaying]);

  useEffect(() => {
    setCategories((cats) =>
      cats.map((cat, index) => {
        const startProgress = index * 20;
        const endProgress = startProgress + 20;

        if (progress < startProgress) {
          return { ...cat, status: 'pending', progress: 0 };
        } else if (progress >= startProgress && progress < endProgress) {
          const categoryProgress = ((progress - startProgress) / 20) * 100;
          return { ...cat, status: 'running', progress: Math.min(categoryProgress, 100) };
        } else {
          return { ...cat, status: 'complete', progress: 100 };
        }
      })
    );
  }, [progress]);

  const handlePlayPause = () => {
    if (progress >= 100) {
      setProgress(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const eta = Math.max(0, Math.ceil((100 - progress) * 0.12));

  return (
    <>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Interactive{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Demo
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Watch DriftWatch analyze a web application in real-time. This simulation shows all five testing dimensions in action.
            </p>
          </div>
        </Container>
      </section>

      {/* Demo Playback Section */}
      <section className="py-20 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Progress Bar */}
            <Card padding="lg" className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Test Run Progress</h2>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-600">
                    ETA: <span className="font-semibold text-gray-900">{eta}s</span>
                  </div>
                  <button
                    onClick={handlePlayPause}
                    className="p-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
                    aria-label={isPlaying ? 'Pause' : progress >= 100 ? 'Restart' : 'Play'}
                  >
                    {progress >= 100 ? (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                      </svg>
                    ) : isPlaying ? (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="mt-2 text-right text-sm font-semibold text-gray-700">
                {progress}% Complete
              </div>
            </Card>

            {/* Category Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {categories.map((category) => (
                <Card
                  key={category.name}
                  padding="md"
                  className={`transition-all duration-300 ${
                    category.status === 'running'
                      ? 'border-2 border-indigo-500 shadow-lg'
                      : category.status === 'complete'
                      ? 'border-2 border-green-500'
                      : 'opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{category.icon}</div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{category.name}</h3>
                        <p className="text-xs text-gray-600 capitalize">{category.status}</p>
                      </div>
                    </div>
                    {category.status === 'complete' && (
                      <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                    {category.status === 'running' && (
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-indigo-600 border-t-transparent" />
                    )}
                  </div>

                  {category.status !== 'pending' && (
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          category.status === 'complete'
                            ? 'bg-green-500'
                            : `bg-${category.color}-500`
                        }`}
                        style={{ width: `${category.progress}%` }}
                      />
                    </div>
                  )}
                </Card>
              ))}
            </div>

            {/* Call to Action Banner */}
            <Card className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white text-center" padding="lg">
              <h2 className="text-2xl font-bold mb-3">
                Want to run DriftWatch on your site?
              </h2>
              <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
                Sign up for free and start testing your web application with all five dimensions. No credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button href="/signup" variant="primary" size="lg" className="bg-white text-indigo-600 hover:bg-gray-50">
                  Sign Up Free
                </Button>
                <Button href="#sample-report" variant="secondary" size="lg">
                  View Sample Report
                </Button>
              </div>
            </Card>
          </div>
        </Container>
      </section>

      {/* Sample Report Section */}
      <section id="sample-report" className="py-20 bg-gray-50">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Sample Report
              </h2>
              <p className="text-xl text-gray-600">
                See what a complete DriftWatch report looks like
              </p>
            </div>

            <Card padding="lg" className="text-center">
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center mb-6">
                <div>
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center">
                    <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 font-medium text-lg">Interactive Report Preview</p>
                  <p className="text-sm text-gray-500 mt-2">Unified HTML report with all test results</p>
                </div>
              </div>

              <p className="text-gray-600 mb-6">
                View a complete sample report showing all five testing dimensions, including detailed findings,
                screenshots, metrics, and recommendations.
              </p>

              <Button href="/report-sample.html" variant="primary" size="lg">
                Open Sample Report
              </Button>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">What's included in the report:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Flow test results with screenshots</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Accessibility violations and fixes</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Performance metrics and scores</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Visual regression comparisons</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">AI design recommendations</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Offline-ready HTML file</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </Container>
      </section>

      {/* Features Highlight */}
      <section className="py-20 bg-white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why choose DriftWatch?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card padding="lg" className="text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast & Efficient</h3>
              <p className="text-gray-600">
                All five testing dimensions run in parallel, delivering comprehensive results in minutes.
              </p>
            </Card>

            <Card padding="lg" className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Privacy First</h3>
              <p className="text-gray-600">
                All testing happens in your infrastructure. No data leaves your environment.
              </p>
            </Card>

            <Card padding="lg" className="text-center">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Developer Friendly</h3>
              <p className="text-gray-600">
                Simple CLI, CI/CD integration, and comprehensive documentation to get started quickly.
              </p>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <Button href="/features" variant="ghost" size="lg">
              Explore All Features →
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}