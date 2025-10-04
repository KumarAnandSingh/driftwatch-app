'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Play, Gauge, Eye, Brain, Accessibility } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Play,
      badge: 'Flow Testing',
      title: 'End-to-end user flows with Playwright',
      description: 'Test critical user journeys automatically. Every step is captured with timestamped screenshots, console logs, and network activity. See exactly what happened when something goes wrong.',
      benefits: [
        'Screenshot timeline with every interaction',
        'Full console and network logs',
        'Timing metrics for each step',
      ],
      color: 'from-blue-500/10 to-blue-600/10',
      iconColor: 'text-blue-600',
    },
    {
      icon: Accessibility,
      badge: 'Accessibility',
      title: 'WCAG compliance with axe-core',
      description: 'Automatically scan every page for accessibility issues. Get detailed findings with severity levels, affected elements, and remediation guidance. Meet WCAG 2.1 AA standards with confidence.',
      benefits: [
        'Comprehensive axe-core rule coverage',
        'Severity classification and impact analysis',
        'Actionable remediation guidance',
      ],
      color: 'from-green-500/10 to-green-600/10',
      iconColor: 'text-green-600',
    },
    {
      icon: Gauge,
      badge: 'Performance',
      title: 'Core Web Vitals and Lighthouse metrics',
      description: 'Monitor the metrics that matter. Track LCP, FID, CLS, and more. Get Lighthouse scores for performance, SEO, and best practices. Ensure fast, responsive experiences across all devices.',
      benefits: [
        'Core Web Vitals (LCP, FID, CLS)',
        'Full Lighthouse audit scores',
        'Resource timing and network analysis',
      ],
      color: 'from-amber-500/10 to-amber-600/10',
      iconColor: 'text-amber-600',
    },
    {
      icon: Eye,
      badge: 'Visual Regression',
      title: 'Pixel-perfect visual comparisons',
      description: 'Catch unintended UI changes before they reach production. Compare screenshots with four views: baseline, current, difference highlighting, and overlay mode. Never miss a visual regression again.',
      benefits: [
        'Four comparison modes (Baseline/Current/Diff/Overlay)',
        'Pixel-level difference detection',
        'Visual regression history tracking',
      ],
      color: 'from-purple-500/10 to-purple-600/10',
      iconColor: 'text-purple-600',
    },
    {
      icon: Brain,
      badge: 'AI Design Critique',
      title: 'Intelligent UX and design feedback',
      description: 'Get AI-powered insights on your design. Receive recommendations for UX patterns, design consistency, accessibility improvements, and best practices. Like having a design expert review every page.',
      benefits: [
        'UX pattern recommendations',
        'Design consistency analysis',
        'Accessibility best practices',
      ],
      color: 'from-pink-500/10 to-pink-600/10',
      iconColor: 'text-pink-600',
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Comprehensive testing in{' '}
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                five dimensions
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              DriftWatch combines multiple testing approaches into a single, unified report.
              Catch issues before your users do.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Sections */}
      {features.map((feature, index) => (
        <section
          key={index}
          className={`py-20 ${index % 2 === 0 ? 'bg-background' : 'bg-accent/50'}`}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
              <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                  {feature.badge}
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                  {feature.title}
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  {feature.description}
                </p>
                <ul className="space-y-3 mb-8">
                  {feature.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle2 className={`w-6 h-6 ${feature.iconColor} mr-3 flex-shrink-0`} />
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                <Card className={`bg-gradient-to-br ${feature.color} border-border`}>
                  <CardContent className="p-8">
                    <div className="aspect-video bg-card rounded-lg shadow-inner flex items-center justify-center">
                      <div className="text-center p-8">
                        <feature.icon className={`w-16 h-16 mx-auto mb-4 ${feature.iconColor}`} />
                        <p className="text-muted-foreground font-medium">{feature.badge}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How it works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to comprehensive quality reports
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Configure Your Tests',
                description: 'Define your user flows, select pages to test, and configure your quality thresholds.',
              },
              {
                step: '2',
                title: 'Run Your Suite',
                description: 'Execute all five testing dimensions in parallel. Track progress in real-time.',
              },
              {
                step: '3',
                title: 'Review Your Report',
                description: 'Get a unified HTML report with all results. Share with your team or integrate into CI/CD.',
              },
            ].map((item, i) => (
              <Card key={i} className="text-center p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-purple-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-transparent border-primary-foreground/20 text-white text-center shadow-2xl">
            <CardHeader>
              <CardTitle className="text-3xl sm:text-4xl font-bold mb-4 text-white">
                See it in action
              </CardTitle>
              <CardDescription className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
                Check out a sample report to see how all five testing dimensions come together.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/demo">View Sample Report</Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-white text-primary hover:bg-white/90 border-white" asChild>
                  <Link href="/signup">Try It Free</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
