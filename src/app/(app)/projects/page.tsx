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

  // Get user with their organization memberships
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      orgMembers: {
        include: {
          org: {
            include: {
              projects: {
                include: {
                  runs: {
                    orderBy: { startedAt: 'desc' },
                    take: 1,
                  },
                  _count: {
                    select: { runs: true },
                  },
                },
                orderBy: { createdAt: 'desc' },
              },
            },
          },
        },
      },
    },
  });

  if (!user) {
    redirect('/signin');
  }

  // Flatten projects from all organizations the user belongs to
  const projects = user.orgMembers.flatMap((member) => member.org.projects);

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
            const lastRun = project.runs[0];
            const totalRuns = project._count.runs;

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
                      {lastRun && (
                        <Badge
                          variant={
                            lastRun.status === 'COMPLETED'
                              ? 'default'
                              : lastRun.status === 'FAILED'
                              ? 'destructive'
                              : 'secondary'
                          }
                          className="ml-2 shrink-0"
                        >
                          {lastRun.status === 'COMPLETED' && (
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                          )}
                          {lastRun.status === 'FAILED' && (
                            <AlertCircle className="h-3 w-3 mr-1" />
                          )}
                          {lastRun.status === 'RUNNING' && (
                            <Activity className="h-3 w-3 mr-1 animate-pulse" />
                          )}
                          {lastRun.status.toLowerCase()}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-3">
                      {/* Run Stats */}
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1.5">
                          <Activity className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{totalRuns}</span>
                          <span className="text-muted-foreground">
                            {totalRuns === 1 ? 'run' : 'runs'}
                          </span>
                        </div>
                        {lastRun && (
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {new Date(lastRun.startedAt).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Last Run Results */}
                      {lastRun && (
                        <div className="grid grid-cols-3 gap-2 pt-3 border-t">
                          <div className="text-center">
                            <div className="text-xs text-muted-foreground mb-1">Score</div>
                            <div className="text-lg font-bold">
                              {lastRun.score || '—'}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-muted-foreground mb-1">Pages</div>
                            <div className="text-lg font-bold">
                              {lastRun.pagesScanned || '—'}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-muted-foreground mb-1">Issues</div>
                            <div className="text-lg font-bold">
                              {lastRun.issuesCritical + lastRun.issuesWarning}
                            </div>
                          </div>
                        </div>
                      )}

                      {!lastRun && (
                        <div className="text-sm text-muted-foreground text-center py-2">
                          No runs yet
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
