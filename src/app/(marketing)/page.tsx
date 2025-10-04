'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Play, CheckCircle2, Zap, Eye, Gauge, Brain } from 'lucide-react';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 opacity-20 blur-3xl pointer-events-none">
          <div className="w-full h-full bg-gradient-to-br from-primary to-purple-600" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Unified quality report for your web app.
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Catch visual regressions, accessibility issues, and performance problems before your users do. One scan, complete insight.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="gap-2" asChild>
                <Link href="/demo" aria-label="Try Live Demo - Interactive demonstration">
                  <Play className="w-4 h-4" />
                  Try Live Demo
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="gap-2" asChild>
                <Link href="/signup" aria-label="Sign up - Start your free trial">
                  Sign up free
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>

            {/* Hero Illustration */}
            <div className="mt-16">
              <Card className="relative overflow-hidden border-border bg-card shadow-2xl">
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-purple-600/10 flex items-center justify-center p-8">
                  <div className="text-center">
                    <Eye className="w-16 h-16 mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground font-medium">Dashboard Preview</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-accent/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How it works</h2>
            <p className="text-lg text-muted-foreground">Three simple steps to complete quality assurance</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Configure your project',
                description: 'Add your domain, verify ownership, and set up authentication if needed.',
                icon: CheckCircle2,
              },
              {
                step: '02',
                title: 'Run DriftWatch',
                description: 'Our scanner crawls your site, testing flows, accessibility, performance, and visuals.',
                icon: Zap,
              },
              {
                step: '03',
                title: 'Review & approve',
                description: 'Get a unified report with actionable insights. Approve baselines and track changes.',
                icon: Eye,
              },
            ].map((item, i) => (
              <Card key={i} className="p-8 border-border">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-sm text-muted-foreground mb-2">{item.step}</div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-6">
            {[
              { icon: Play, label: 'Flows', color: 'text-blue-500' },
              { icon: CheckCircle2, label: 'Accessibility', color: 'text-green-500' },
              { icon: Gauge, label: 'Performance', color: 'text-amber-500' },
              { icon: Eye, label: 'Visual Regression', color: 'text-purple-500' },
              { icon: Brain, label: 'AI Critique', color: 'text-pink-500' },
            ].map((feature, i) => (
              <Link key={i} href="/features">
                <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer border-border">
                  <feature.icon className={`w-8 h-8 mx-auto mb-3 ${feature.color}`} />
                  <h4 className="font-semibold">{feature.label}</h4>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary to-purple-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
            Ready to get started?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Join teams who trust DriftWatch to maintain web quality. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/demo" aria-label="View Demo - See DriftWatch in action">View Demo</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white text-primary hover:bg-white/90 border-white" asChild>
              <Link href="/signup" aria-label="Start Free Today - Create account">Start Free Today</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
