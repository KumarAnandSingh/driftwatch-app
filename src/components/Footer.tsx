import React from 'react';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-accent/30 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-primary to-purple-600" />
              <span className="font-semibold">DriftWatch</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Quality monitoring for modern web applications.
            </p>
          </div>

          {/* Product */}
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

          {/* Resources */}
          <div>
            <h4 className="mb-4 text-sm font-semibold">Resources</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <Link href="/docs" className="block hover:text-foreground">
                Docs
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-4 text-sm font-semibold">Legal</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <Link href="/privacy" className="block hover:text-foreground">
                Privacy
              </Link>
              <Link href="/terms" className="block hover:text-foreground">
                Terms
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
          © {currentYear} DriftWatch. All rights reserved.
        </div>
      </div>
    </footer>
  );
}