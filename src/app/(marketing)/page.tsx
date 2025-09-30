'use client';

import Link from 'next/link';
import { MarketingHeader } from '@/components/MarketingHeader';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, CheckCircle2, Zap, Eye, Gauge, Brain } from 'lucide-react';
import { motion } from 'motion/react';

export default function Home() {
  return (
    <div className="min-h-screen">
      <MarketingHeader currentPath="/" />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />

        {/* Subtle Scan Halo Accent */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 opacity-20 blur-3xl pointer-events-none">
          <div className="w-full h-full bg-gradient-to-br from-primary to-purple-600" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Unified quality report for your web app.
              </h1>

              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Catch visual regressions, accessibility issues, and performance problems before your users do. One scan, complete insight.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="gap-2" asChild>
                  <Link href="/demo">
                    <Play className="w-4 h-4" />
                    Try Live Demo
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="gap-2" asChild>
                  <Link href="/sign-up">
                    Sign up
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>

            {/* Hero Illustration */}
            <motion.div
              className="mt-16 relative"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              {/* Scan Halo Glow */}
              <motion.div
                className="absolute -inset-4 rounded-2xl opacity-30 blur-2xl"
                animate={{
                  background: [
                    'linear-gradient(90deg, hsl(var(--primary)), hsl(262 80% 60%), hsl(280 80% 50%))',
                    'linear-gradient(180deg, hsl(262 80% 60%), hsl(280 80% 50%), hsl(var(--primary)))',
                    'linear-gradient(270deg, hsl(280 80% 50%), hsl(var(--primary)), hsl(262 80% 60%))',
                    'linear-gradient(360deg, hsl(var(--primary)), hsl(262 80% 60%), hsl(280 80% 50%))',
                  ],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />

              <div className="relative rounded-xl overflow-hidden shadow-2xl border border-border bg-card">
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-purple-600/10 flex items-center justify-center">
                  <div className="text-center">
                    <Eye className="w-16 h-16 mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Dashboard Preview</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-accent/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-card rounded-xl p-8 border border-border"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-sm text-muted-foreground mb-2">{item.step}</div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-6">
            {[
              { icon: Play, label: 'Flows', color: 'text-blue-500' },
              { icon: CheckCircle2, label: 'Accessibility', color: 'text-green-500' },
              { icon: Gauge, label: 'Performance', color: 'text-amber-500' },
              { icon: Eye, label: 'Visual Regression', color: 'text-purple-500' },
              { icon: Brain, label: 'AI Critique', color: 'text-pink-500' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
              >
                <Link href="/features">
                  <div className="bg-card rounded-xl p-6 border border-border text-center hover:shadow-lg transition-shadow cursor-pointer">
                    <feature.icon className={`w-8 h-8 mx-auto mb-3 ${feature.color}`} />
                    <h4 className="font-semibold">{feature.label}</h4>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-accent/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded bg-gradient-to-br from-primary to-purple-600" />
                <span className="font-semibold">DriftWatch</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Quality monitoring for modern web applications.
              </p>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold">Product</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <Link href="/features" className="block hover:text-foreground">
                  Features
                </Link>
                <Link href="/pricing" className="block hover:text-foreground">
                  Pricing
                </Link>
                <Link href="/demo" className="block hover:text-foreground">
                  Demo
                </Link>
              </div>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold">Resources</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <Link href="/docs" className="block hover:text-foreground">
                  Docs
                </Link>
                <div className="hover:text-foreground cursor-pointer">Changelog</div>
                <div className="hover:text-foreground cursor-pointer">Status</div>
              </div>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold">Legal</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="hover:text-foreground cursor-pointer">Privacy</div>
                <div className="hover:text-foreground cursor-pointer">Terms</div>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © 2025 DriftWatch. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
