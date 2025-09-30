'use client';

import Link from 'next/link';
import { Eye } from 'lucide-react';
import { Button } from './ui/button';

interface MarketingHeaderProps {
  currentPath?: string;
}

export function MarketingHeader({ currentPath }: MarketingHeaderProps) {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(280,80%,50%)] shadow-md flex items-center justify-center transition-transform group-hover:scale-105">
            <Eye className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-semibold">DriftWatch</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/features"
            className={`text-sm transition-colors ${
              currentPath === '/features'
                ? 'text-foreground font-medium'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Features
          </Link>
          <Link
            href="/demo"
            className={`text-sm transition-colors ${
              currentPath === '/demo'
                ? 'text-foreground font-medium'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Demo
          </Link>
          <Link
            href="/pricing"
            className={`text-sm transition-colors ${
              currentPath === '/pricing'
                ? 'text-foreground font-medium'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Pricing
          </Link>
          <Link
            href="/docs"
            className={`text-sm transition-colors ${
              currentPath === '/docs'
                ? 'text-foreground font-medium'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Docs
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/sign-up">Sign up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
