import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Globe, Activity, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

export default async function ProjectsPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect('/signin');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      projects: {
        include: {
          scans: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
          _count: {
            select: { scans: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!user) {
    redirect('/signin');
  }

  const projects = user.projects;

  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-2">
            Manage and monitor all your website quality projects
          </p>
        </div>
        <Link href="/projects/new">
          <Button size="lg" className="gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Globe className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Create your first project to start monitoring website quality, accessibility, and performance
            </p>
            <Link href="/projects/new">
              <Button size="lg" className="gap-2">
                <Plus className="h-4 w-4" />
                Create Your First Project
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const lastScan = project.scans[0];
            const totalScans = project._count.scans;

            return (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="line-clamp-1">{project.name}</CardTitle>
                        <CardDescription className="line-clamp-1 mt-1">
                          {project.url}
                        </CardDescription>
                      </div>
                      {lastScan && (
                        <Badge
                          variant={
                            lastScan.status === 'completed'
                              ? 'default'
                              : lastScan.status === 'failed'
                              ? 'destructive'
                              : 'secondary'
                          }
                          className="ml-2 shrink-0"
                        >
                          {lastScan.status === 'completed' && (
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                          )}
                          {lastScan.status === 'failed' && (
                            <AlertCircle className="h-3 w-3 mr-1" />
                          )}
                          {lastScan.status === 'running' && (
                            <Activity className="h-3 w-3 mr-1 animate-pulse" />
                          )}
                          {lastScan.status}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-3">
                      {/* Scan Stats */}
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1.5">
                          <Activity className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{totalScans}</span>
                          <span className="text-muted-foreground">
                            {totalScans === 1 ? 'scan' : 'scans'}
                          </span>
                        </div>
                        {lastScan && (
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {new Date(lastScan.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Last Scan Results */}
                      {lastScan?.results && (
                        <div className="grid grid-cols-3 gap-2 pt-3 border-t">
                          <div className="text-center">
                            <div className="text-xs text-muted-foreground mb-1">A11y</div>
                            <div className="text-lg font-bold">
                              {lastScan.results.accessibility?.score || '—'}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-muted-foreground mb-1">Perf</div>
                            <div className="text-lg font-bold">
                              {lastScan.results.performance?.score || '—'}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-muted-foreground mb-1">Issues</div>
                            <div className="text-lg font-bold">
                              {lastScan.results.visual?.differences || 0}
                            </div>
                          </div>
                        </div>
                      )}

                      {!lastScan && (
                        <div className="text-sm text-muted-foreground text-center py-2">
                          No scans yet
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
