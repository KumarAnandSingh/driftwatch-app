'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Activity,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  FolderKanban,
  Plus,
  TrendingDown,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface DashboardStats {
  totalProjects: number;
  activeScans: number;
  recentAlerts: number;
  avgScore: number;
  scoreTrend: 'up' | 'down' | 'stable';
}

interface RecentScan {
  id: string;
  projectName: string;
  projectId: string;
  url: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'FAILED';
  score: number | null;
  startedAt: string;
  finishedAt: string | null;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentScans, setRecentScans] = useState<RecentScan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, scansRes] = await Promise.all([
          fetch('/api/dashboard/stats'),
          fetch('/api/dashboard/recent-scans'),
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        if (scansRes.ok) {
          const scansData = await scansRes.json();
          setRecentScans(scansData);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchDashboardData();
    }
  }, [status]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Completed
        </Badge>;
      case 'IN_PROGRESS':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
          <Activity className="h-3 w-3 mr-1 animate-pulse" />
          Running
        </Badge>;
      case 'FAILED':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
          <AlertCircle className="h-3 w-3 mr-1" />
          Failed
        </Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {session?.user?.name || session?.user?.email?.split('@')[0]}!
          </h1>
          <p className="text-muted-foreground">
            Here's an overview of your website quality monitoring
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <FolderKanban className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalProjects || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Websites being monitored
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Scans</CardTitle>
              <Activity className="h-4 w-4 text-blue-600 animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.activeScans || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Currently running
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Alerts</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.recentAlerts || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Last 7 days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <Zap className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getScoreColor(stats?.avgScore || 0)}`}>
                {stats?.avgScore || 0}
              </div>
              <div className="flex items-center text-xs mt-1">
                {stats?.scoreTrend === 'up' && (
                  <>
                    <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                    <span className="text-green-600">Improving</span>
                  </>
                )}
                {stats?.scoreTrend === 'down' && (
                  <>
                    <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                    <span className="text-red-600">Declining</span>
                  </>
                )}
                {stats?.scoreTrend === 'stable' && (
                  <span className="text-muted-foreground">Stable</span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create New Project
              </CardTitle>
              <CardDescription>
                Start monitoring a new website for quality issues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/projects/new">
                <Button className="w-full gap-2" size="lg">
                  New Project
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderKanban className="h-5 w-5" />
                View All Projects
              </CardTitle>
              <CardDescription>
                Manage and monitor all your existing projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/projects">
                <Button variant="outline" className="w-full gap-2" size="lg">
                  View Projects
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Scans */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Scans</CardTitle>
                <CardDescription>Your latest website quality scans</CardDescription>
              </div>
              <Link href="/projects">
                <Button variant="ghost" size="sm" className="gap-2">
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentScans.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No scans yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first project to start monitoring website quality
                </p>
                <Link href="/projects/new">
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create First Project
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentScans.map((scan) => (
                  <Link
                    key={scan.id}
                    href={`/projects/${scan.projectId}/runs/${scan.id}/results`}
                    className="block"
                  >
                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex-1 min-w-0 mr-4">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold truncate">{scan.projectName}</h4>
                          {getStatusBadge(scan.status)}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{scan.url}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(scan.startedAt).toLocaleString()}
                        </p>
                      </div>
                      {scan.status === 'COMPLETED' && scan.score !== null && (
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className={`text-3xl font-bold ${getScoreColor(scan.score)}`}>
                              {scan.score}
                            </div>
                            <Badge className={getScoreBadge(scan.score)}>
                              {scan.score >= 90 ? 'Excellent' : scan.score >= 70 ? 'Good' : 'Needs Work'}
                            </Badge>
                          </div>
                          <ArrowRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                      {scan.status === 'IN_PROGRESS' && (
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                          <ArrowRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
