'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Rocket, Clock, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Project {
  id: string;
  name: string;
  description?: string;
  url: string;
  createdAt: string;
}

interface Run {
  id: string;
  status: string;
  progress: number;
  score?: number;
  pagesScanned?: number;
  issuesCritical: number;
  issuesWarning: number;
  issuesPassed: number;
  startedAt: string;
  finishedAt?: string;
}

export default function ProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.projectId as string;

  const [project, setProject] = useState<Project | null>(null);
  const [runs, setRuns] = useState<Run[]>([]);
  const [isStartingScan, setIsStartingScan] = useState(false);

  useEffect(() => {
    fetchProject();
    fetchRuns();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`);
      if (!response.ok) throw new Error('Failed to fetch project');
      const data = await response.json();
      setProject(data);
    } catch (error) {
      console.error('Error fetching project:', error);
    }
  };

  const fetchRuns = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/runs`);
      if (!response.ok) throw new Error('Failed to fetch runs');
      const data = await response.json();
      setRuns(data.runs || []);
    } catch (error) {
      console.error('Error fetching runs:', error);
    }
  };

  const startNewScan = async () => {
    setIsStartingScan(true);

    try {
      const response = await fetch(`/api/projects/${projectId}/runs`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to start scan');

      const run = await response.json();

      // Redirect to progress page
      router.push(`/projects/${projectId}/runs/${run.id}`);
    } catch (error) {
      console.error('Error starting scan:', error);
      alert('Failed to start scan. Please try again.');
      setIsStartingScan(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'RUNNING':
        return <Badge className="bg-blue-500">Running</Badge>;
      case 'QUEUED':
        return <Badge className="bg-yellow-500">Queued</Badge>;
      case 'FAILED':
        return <Badge className="bg-red-500">Failed</Badge>;
      case 'CANCELLED':
        return <Badge variant="outline">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'RUNNING':
      case 'QUEUED':
        return <Clock className="h-5 w-5 text-blue-600 animate-spin" />;
      case 'FAILED':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    }
  };

  if (!project) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p>Loading project...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
        {project.description && (
          <p className="text-muted-foreground">{project.description}</p>
        )}
        <p className="text-sm text-muted-foreground mt-2">
          URL: <span className="font-mono">{project.url}</span>
        </p>
      </div>

      {/* Start New Scan */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Start a new quality scan for this project</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={startNewScan}
            disabled={isStartingScan}
            className="gap-2"
            size="lg"
          >
            <Rocket className="h-5 w-5" />
            {isStartingScan ? 'Starting Scan...' : 'Run New Scan'}
          </Button>
        </CardContent>
      </Card>

      {/* Scan History */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Scan History</h2>

        {runs.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              <p>No scans yet. Start your first scan above!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {runs.map((run) => (
              <Card
                key={run.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => {
                  if (run.status === 'RUNNING' || run.status === 'QUEUED') {
                    router.push(`/projects/${projectId}/runs/${run.id}`);
                  } else if (run.status === 'COMPLETED') {
                    router.push(`/projects/${projectId}/runs/${run.id}/results`);
                  }
                }}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {getStatusIcon(run.status)}

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {getStatusBadge(run.status)}
                          {run.score !== undefined && run.score !== null && (
                            <span className="text-sm font-mono font-semibold">
                              {run.score}/100
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-muted-foreground">
                          Started {new Date(run.startedAt).toLocaleString()}
                        </p>

                        {run.status === 'RUNNING' && (
                          <p className="text-sm text-blue-600 mt-1">
                            Progress: {run.progress}%
                          </p>
                        )}
                      </div>
                    </div>

                    {run.status === 'COMPLETED' && (
                      <div className="grid grid-cols-3 gap-4 text-center text-sm">
                        <div>
                          <div className="font-mono font-semibold text-lg text-red-600">
                            {run.issuesCritical}
                          </div>
                          <div className="text-muted-foreground">Critical</div>
                        </div>
                        <div>
                          <div className="font-mono font-semibold text-lg text-yellow-600">
                            {run.issuesWarning}
                          </div>
                          <div className="text-muted-foreground">Warnings</div>
                        </div>
                        <div>
                          <div className="font-mono font-semibold text-lg text-green-600">
                            {run.issuesPassed}
                          </div>
                          <div className="text-muted-foreground">Passed</div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
