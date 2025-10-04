'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, RotateCcw, CheckCircle2, Zap, Shield, Code } from 'lucide-react';

export default function Demo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return prev + 1;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const handleRestart = () => {
    setProgress(0);
    setIsPlaying(true);
  };

  const categories = [
    { name: 'Flows', status: progress > 20 ? 'complete' : 'pending', color: 'text-blue-600' },
    { name: 'Accessibility', status: progress > 40 ? 'complete' : 'pending', color: 'text-green-600' },
    { name: 'Performance', status: progress > 60 ? 'complete' : 'pending', color: 'text-amber-600' },
    { name: 'Visual', status: progress > 80 ? 'complete' : 'pending', color: 'text-purple-600' },
    { name: 'AI Critique', status: progress === 100 ? 'complete' : 'pending', color: 'text-pink-600' },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              See DriftWatch in{' '}
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                action
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Watch how DriftWatch scans a real website and generates a comprehensive quality report in seconds.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <Card className="shadow-2xl border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Live Demo - Testing example.com</CardTitle>
                  <CardDescription className="mt-2">
                    Running all 5 testing dimensions
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setIsPlaying(!isPlaying)}
                    disabled={progress === 100 && !isPlaying}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <Button size="icon" variant="outline" onClick={handleRestart}>
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Overall Progress</span>
                  <span className="font-semibold">{progress}%</span>
                </div>
                <Progress value={progress} className="h-3" />
              </div>

              {/* Category Status */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {categories.map((category, i) => (
                  <Card key={i} className={`border-border ${category.status === 'complete' ? 'bg-accent/50' : ''}`}>
                    <CardContent className="p-4 text-center">
                      <div className={`mb-2 ${category.color}`}>
                        {category.status === 'complete' ? (
                          <CheckCircle2 className="w-6 h-6 mx-auto" />
                        ) : (
                          <div className="w-6 h-6 mx-auto border-2 border-current rounded-full opacity-30" />
                        )}
                      </div>
                      <p className="text-sm font-medium">{category.name}</p>
                      <Badge variant={category.status === 'complete' ? 'default' : 'secondary'} className="mt-2 text-xs">
                        {category.status === 'complete' ? 'Done' : 'Pending'}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Results Preview */}
              {progress === 100 && (
                <div className="mt-6 p-6 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="w-8 h-8 text-primary flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Scan Complete!</h3>
                      <p className="text-muted-foreground mb-4">
                        All 5 testing dimensions completed successfully. Your comprehensive quality report is ready.
                      </p>
                      <Button size="sm" asChild>
                        <Link href="/signup">Create Your Own Report</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Sample Report Preview */}
      <section className="py-20 bg-accent/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Unified Quality Report
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              All testing results in one comprehensive, easy-to-understand report
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="border-border">
              <CardContent className="p-8">
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-purple-600/10 rounded-lg flex items-center justify-center mb-6">
                  <Code className="w-16 h-16 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Detailed Test Results</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span>Step-by-step flow execution with screenshots</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span>Accessibility violations with severity levels</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span>Performance metrics and Core Web Vitals</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span>Visual regression comparisons</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span>AI-powered design recommendations</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-8">
                <div className="aspect-video bg-gradient-to-br from-amber-500/10 to-orange-600/10 rounded-lg flex items-center justify-center mb-6">
                  <Zap className="w-16 h-16 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Actionable Insights</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span>Priority-ranked issues with impact analysis</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span>Remediation guidance for each finding</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span>Trend analysis across test runs</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span>Exportable HTML and JSON formats</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span>CI/CD integration ready</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: Shield,
                title: 'Catch Issues Early',
                description: 'Identify bugs, accessibility problems, and performance bottlenecks before they reach production.',
                color: 'text-green-600',
                bgColor: 'from-green-500/10 to-green-600/10',
              },
              {
                icon: Zap,
                title: 'Save Time',
                description: 'Automated testing across all dimensions means faster releases with confidence.',
                color: 'text-amber-600',
                bgColor: 'from-amber-500/10 to-amber-600/10',
              },
              {
                icon: Code,
                title: 'Improve Quality',
                description: 'Continuous monitoring ensures your web app maintains high quality standards.',
                color: 'text-blue-600',
                bgColor: 'from-blue-500/10 to-blue-600/10',
              },
            ].map((benefit, i) => (
              <Card key={i} className="text-center border-border">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${benefit.bgColor} rounded-full flex items-center justify-center`}>
                    <benefit.icon className={`w-8 h-8 ${benefit.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary to-purple-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
            Ready to try it yourself?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Sign up now and run your first quality scan for free. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/features">Explore Features</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white text-primary hover:bg-white/90 border-white" asChild>
              <Link href="/signup">Start Free Trial</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
