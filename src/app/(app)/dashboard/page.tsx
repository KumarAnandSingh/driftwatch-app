'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, CheckCircle2, AlertTriangle, XCircle, Clock } from 'lucide-react';

export default function Dashboard() {
  const projects = [
    {
      id: 'ecommerce',
      name: 'E-commerce Platform',
      domain: 'shop.example.com',
      lastRun: '2 hours ago',
      status: 'passed',
      issues: { critical: 0, warnings: 3, passed: 47 },
      score: 94,
    },
    {
      id: 'marketing',
      name: 'Marketing Site',
      domain: 'www.example.com',
      lastRun: '1 day ago',
      status: 'warning',
      issues: { critical: 0, warnings: 8, passed: 42 },
      score: 87,
    },
    {
      id: 'dashboard',
      name: 'Dashboard App',
      domain: 'app.example.com',
      lastRun: '3 days ago',
      status: 'failed',
      issues: { critical: 2, warnings: 5, passed: 38 },
      score: 72,
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'passed':
        return (
          <Badge className="bg-green-50 text-green-700 border-green-200">
            Passed
          </Badge>
        );
      case 'warning':
        return (
          <Badge className="bg-amber-50 text-amber-700 border-amber-200">
            Warning
          </Badge>
        );
      case 'failed':
        return (
          <Badge className="bg-red-50 text-red-700 border-red-200">Failed</Badge>
        );
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Projects</h1>
          <p className="text-muted-foreground">
            Manage your quality monitoring projects
          </p>
        </div>
        <Button className="gap-2" asChild>
          <Link href="/projects/new">
            <Plus className="w-4 h-4" />
            Create Project
          </Link>
        </Button>
      </div>

      {projects.length === 0 ? (
        /* Empty State */
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-accent mx-auto mb-4 flex items-center justify-center">
            <Eye className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Create your first project to start monitoring your web application
            quality.
          </p>
          <Button className="gap-2" asChild>
            <Link href="/projects/new">
              <Plus className="w-4 h-4" />
              Create Project
            </Link>
          </Button>
        </div>
      ) : (
        /* Project Cards */
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow p-6 block"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">{project.name}</h3>
                  <p className="text-sm text-muted-foreground">{project.domain}</p>
                </div>
                {getStatusIcon(project.status)}
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Last run</span>
                  <span>{project.lastRun}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  {getStatusBadge(project.status)}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Score</span>
                  <span className="font-mono font-semibold">
                    {project.score}/100
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <div className="text-red-600 font-mono font-semibold mb-1">
                      {project.issues.critical}
                    </div>
                    <div className="text-muted-foreground">Critical</div>
                  </div>
                  <div>
                    <div className="text-amber-600 font-mono font-semibold mb-1">
                      {project.issues.warnings}
                    </div>
                    <div className="text-muted-foreground">Warnings</div>
                  </div>
                  <div>
                    <div className="text-green-600 font-mono font-semibold mb-1">
                      {project.issues.passed}
                    </div>
                    <div className="text-muted-foreground">Passed</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
