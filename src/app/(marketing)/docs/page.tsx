'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Code, Rocket, Settings, FileText, Zap } from 'lucide-react';

export default function DocsPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Documentation
            </h1>
            <p className="text-xl text-muted-foreground">
              Everything you need to get started with DriftWatch and monitor your web application quality.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Start Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Quick Start</h2>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card>
                <CardHeader>
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-2">
                    <Rocket className="w-5 h-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">1. Sign Up</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Create your free account and add your first project.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center mb-2">
                    <Settings className="w-5 h-5 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">2. Configure</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Set up your domain, authentication, and testing flows.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-2">
                    <Zap className="w-5 h-5 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg">3. Run Scan</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Launch your first quality scan and review results.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            {/* Documentation Sections */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-6 h-6 text-primary" />
                    <CardTitle>Getting Started</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/docs/installation" className="block text-foreground hover:text-primary transition-colors">
                    → Installation and Setup
                  </Link>
                  <Link href="/docs/first-scan" className="block text-foreground hover:text-primary transition-colors">
                    → Running Your First Scan
                  </Link>
                  <Link href="/docs/configuration" className="block text-foreground hover:text-primary transition-colors">
                    → Configuration Options
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Code className="w-6 h-6 text-primary" />
                    <CardTitle>API Reference</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/docs/api/authentication" className="block text-foreground hover:text-primary transition-colors">
                    → Authentication
                  </Link>
                  <Link href="/docs/api/scans" className="block text-foreground hover:text-primary transition-colors">
                    → Scans API
                  </Link>
                  <Link href="/docs/api/webhooks" className="block text-foreground hover:text-primary transition-colors">
                    → Webhooks
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-primary" />
                    <CardTitle>Guides</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/docs/guides/flows" className="block text-foreground hover:text-primary transition-colors">
                    → Setting Up User Flows
                  </Link>
                  <Link href="/docs/guides/accessibility" className="block text-foreground hover:text-primary transition-colors">
                    → Accessibility Testing
                  </Link>
                  <Link href="/docs/guides/performance" className="block text-foreground hover:text-primary transition-colors">
                    → Performance Optimization
                  </Link>
                  <Link href="/docs/guides/visual-regression" className="block text-foreground hover:text-primary transition-colors">
                    → Visual Regression Testing
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* CTA */}
            <div className="mt-12 p-8 bg-gradient-to-br from-primary/10 to-purple-600/10 rounded-lg text-center">
              <h3 className="text-2xl font-bold mb-3">Need Help?</h3>
              <p className="text-muted-foreground mb-6">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <Link href="/contact">Contact Support</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/demo">Try Live Demo</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
