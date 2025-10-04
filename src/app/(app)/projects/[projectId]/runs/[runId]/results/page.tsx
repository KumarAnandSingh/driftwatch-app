'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  ChevronLeft,
  Download,
  Share2,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  Zap,
  Globe,
  Accessibility,
  Brain,
  TrendingUp,
  Calendar,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Run {
  id: string;
  status: string;
  progress: number;
  score: number;
  pagesScanned: number;
  issuesCritical: number;
  issuesWarning: number;
  issuesPassed: number;
  startedAt: string;
  finishedAt: string;
  crawlResult?: {
    pages: number;
    urls: string[];
  };
  screenshotResults?: Array<{
    url: string;
    path: string;
    width: number;
    height: number;
  }>;
  a11yResults?: Array<{
    url: string;
    score: number;
    violations: Array<{
      id: string;
      impact: 'critical' | 'serious' | 'moderate' | 'minor';
      description: string;
      help: string;
      helpUrl: string;
      nodes: Array<{
        html: string;
        target: string[];
      }>;
    }>;
    passes: number;
  }>;
  aiCritiqueResults?: Array<{
    url: string;
    score: number;
    summary: string;
    strengths: string[];
    issues: Array<{
      category: string;
      severity: 'high' | 'medium' | 'low';
      description: string;
      suggestion: string;
    }>;
  }>;
}

interface Project {
  id: string;
  name: string;
  url: string;
}

export default function ResultsPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.projectId as string;
  const runId = params.runId as string;

  const [run, setRun] = useState<Run | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [celebrationShown, setCelebrationShown] = useState(false);
  const [expandedIssues, setExpandedIssues] = useState<Set<string>>(new Set());
  const [selectedScreenshot, setSelectedScreenshot] = useState<number | null>(null);

  useEffect(() => {
    fetchResults();
  }, [projectId, runId]);

  const fetchResults = async () => {
    try {
      const [runRes, projectRes] = await Promise.all([
        fetch(`/api/projects/${projectId}/runs/${runId}/status`),
        fetch(`/api/projects/${projectId}`),
      ]);

      const runData = await runRes.json();
      const projectData = await projectRes.json();

      setRun(runData);
      setProject(projectData);
      setIsLoading(false);

      // Celebration effect (only once)
      if (!celebrationShown && runData.score) {
        setCelebrationShown(true);

        if (runData.score >= 90) {
          confetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.5 },
            colors: ['#10b981', '#34d399', '#6ee7b7'],
          });
        } else if (runData.score >= 70) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      }
    } catch (error) {
      console.error('Error fetching results:', error);
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number): string => {
    if (score >= 90) return 'bg-green-50 dark:bg-green-950/20 border-green-200';
    if (score >= 70) return 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200';
    return 'bg-red-50 dark:bg-red-950/20 border-red-200';
  };

  const getScoreMessage = (score: number): string => {
    if (score >= 90) return 'Excellent! Your website meets high quality standards.';
    if (score >= 70) return 'Good! Some improvements can enhance user experience.';
    return 'Needs Attention. Several issues require fixing for better quality.';
  };

  const toggleIssueExpanded = (issueId: string) => {
    const newExpanded = new Set(expandedIssues);
    if (newExpanded.has(issueId)) {
      newExpanded.delete(issueId);
    } else {
      newExpanded.add(issueId);
    }
    setExpandedIssues(newExpanded);
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <Badge className="bg-red-500">Critical</Badge>;
      case 'serious':
      case 'medium':
        return <Badge className="bg-yellow-500">Warning</Badge>;
      case 'moderate':
      case 'low':
        return <Badge className="bg-blue-500">Minor</Badge>;
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p>Loading results...</p>
      </div>
    );
  }

  if (!run || !project) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p>Results not found</p>
      </div>
    );
  }

  const totalIssues = run.issuesCritical + run.issuesWarning;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => router.push(`/projects/${projectId}`)}
          className="mb-4"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Project
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Quality Report</h1>
            <p className="text-muted-foreground">
              {project.name} • {new Date(run.finishedAt).toLocaleString()}
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Overall Score Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className={`mb-8 ${getScoreBgColor(run.score)}`}>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Score Display */}
              <div className="text-center md:text-left">
                <div className="flex items-center gap-4 justify-center md:justify-start mb-4">
                  <div className={`text-7xl font-bold ${getScoreColor(run.score)}`}>
                    {run.score}
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-semibold text-muted-foreground">/100</div>
                    <div className="text-sm text-muted-foreground">Quality Score</div>
                  </div>
                </div>

                <p className="text-lg font-medium mb-2">{getScoreMessage(run.score)}</p>
                <p className="text-sm text-muted-foreground">
                  Scanned {run.pagesScanned} pages in {Math.round((new Date(run.finishedAt).getTime() - new Date(run.startedAt).getTime()) / 1000 / 60)} minutes
                </p>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <XCircle className="h-8 w-8 text-red-600" />
                  </div>
                  <div className="text-3xl font-bold text-red-600">{run.issuesCritical}</div>
                  <div className="text-sm text-muted-foreground">Critical</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <AlertTriangle className="h-8 w-8 text-yellow-600" />
                  </div>
                  <div className="text-3xl font-bold text-yellow-600">{run.issuesWarning}</div>
                  <div className="text-sm text-muted-foreground">Warnings</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="text-3xl font-bold text-green-600">{run.issuesPassed}</div>
                  <div className="text-sm text-muted-foreground">Passed</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Premium "Fix It For Me" CTA */}
      {totalIssues > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="mb-8 border-primary bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1">Let DriftWatch Fix It For You</h3>
                    <p className="text-sm text-muted-foreground">
                      Get AI-generated code snippets and fixes for all {totalIssues} issues • Premium Feature
                    </p>
                  </div>
                </div>
                <Button size="lg" className="gap-2">
                  <Sparkles className="h-5 w-5" />
                  Fix It For Me
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Detailed Results Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">
            <TrendingUp className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="accessibility">
            <Accessibility className="h-4 w-4 mr-2" />
            Accessibility
          </TabsTrigger>
          <TabsTrigger value="ai-insights">
            <Brain className="h-4 w-4 mr-2" />
            AI Insights
          </TabsTrigger>
          <TabsTrigger value="screenshots">
            <Eye className="h-4 w-4 mr-2" />
            Screenshots
          </TabsTrigger>
          <TabsTrigger value="pages">
            <Globe className="h-4 w-4 mr-2" />
            Pages
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Critical Issues Section */}
          {run.issuesCritical > 0 && run.a11yResults && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  Critical Issues Requiring Immediate Attention
                </CardTitle>
                <CardDescription>
                  {run.issuesCritical} critical accessibility violations found
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {run.a11yResults.flatMap((pageResult) =>
                  pageResult.violations
                    .filter((v) => v.impact === 'critical')
                    .slice(0, 5)
                    .map((violation, idx) => {
                      const issueId = `critical-${pageResult.url}-${idx}`;
                      const isExpanded = expandedIssues.has(issueId);

                      return (
                        <div key={issueId} className="border rounded-lg p-4">
                          <div
                            className="flex items-start justify-between cursor-pointer"
                            onClick={() => toggleIssueExpanded(issueId)}
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                {getSeverityBadge(violation.impact)}
                                <h4 className="font-semibold">{violation.help}</h4>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {violation.description}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Globe className="h-3 w-3" />
                                {pageResult.url}
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              {isExpanded ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                          </div>

                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="mt-4 pt-4 border-t space-y-3"
                              >
                                <div>
                                  <h5 className="text-sm font-semibold mb-2">Affected Elements:</h5>
                                  {violation.nodes.slice(0, 3).map((node, nodeIdx) => (
                                    <div key={nodeIdx} className="mb-2">
                                      <code className="text-xs bg-muted p-2 rounded block overflow-x-auto">
                                        {node.html}
                                      </code>
                                      <p className="text-xs text-muted-foreground mt-1">
                                        Selector: {node.target.join(' > ')}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                                <div>
                                  <a
                                    href={violation.helpUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-primary hover:underline flex items-center gap-1"
                                  >
                                    Learn more about this issue
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })
                )}
              </CardContent>
            </Card>
          )}

          {/* Score Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Score Breakdown</CardTitle>
              <CardDescription>How your score was calculated</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {run.a11yResults && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Accessibility className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Accessibility</span>
                    </div>
                    <span className="font-mono font-semibold">
                      {Math.round(
                        run.a11yResults.reduce((sum, r) => sum + r.score, 0) / run.a11yResults.length
                      )}
                      /100
                    </span>
                  </div>
                  <Progress
                    value={
                      run.a11yResults.reduce((sum, r) => sum + r.score, 0) / run.a11yResults.length
                    }
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Weight: 40%</p>
                </div>
              )}

              {run.aiCritiqueResults && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-indigo-600" />
                      <span className="font-medium">AI Design Critique</span>
                    </div>
                    <span className="font-mono font-semibold">
                      {Math.round(
                        run.aiCritiqueResults.reduce((sum, r) => sum + r.score, 0) /
                          run.aiCritiqueResults.length
                      )}
                      /100
                    </span>
                  </div>
                  <Progress
                    value={
                      run.aiCritiqueResults.reduce((sum, r) => sum + r.score, 0) /
                      run.aiCritiqueResults.length
                    }
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Weight: 40%</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Accessibility Tab */}
        <TabsContent value="accessibility" className="space-y-6">
          {run.a11yResults?.map((pageResult, idx) => (
            <Card key={idx}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{pageResult.url}</CardTitle>
                    <CardDescription>
                      {pageResult.violations.length} violations • {pageResult.passes} passed checks
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getScoreColor(pageResult.score)}`}>
                      {pageResult.score}
                    </div>
                    <div className="text-xs text-muted-foreground">Score</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {pageResult.violations.slice(0, 10).map((violation, vIdx) => (
                  <div key={vIdx} className="border-l-4 border-l-red-500 pl-4 py-2">
                    <div className="flex items-center gap-2 mb-1">
                      {getSeverityBadge(violation.impact)}
                      <span className="font-medium text-sm">{violation.help}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{violation.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {violation.nodes.length} elements affected
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="ai-insights" className="space-y-6">
          {run.aiCritiqueResults?.map((pageResult, idx) => (
            <Card key={idx}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{pageResult.url}</CardTitle>
                    <CardDescription>{pageResult.summary}</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getScoreColor(pageResult.score)}`}>
                      {pageResult.score}
                    </div>
                    <div className="text-xs text-muted-foreground">AI Score</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Strengths */}
                {pageResult.strengths.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Strengths
                    </h4>
                    <ul className="space-y-1">
                      {pageResult.strengths.map((strength, sIdx) => (
                        <li key={sIdx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-green-600">•</span>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Issues */}
                {pageResult.issues.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      Design Issues
                    </h4>
                    <div className="space-y-3">
                      {pageResult.issues.map((issue, iIdx) => (
                        <div key={iIdx} className="border rounded-lg p-3">
                          <div className="flex items-start gap-2 mb-2">
                            {getSeverityBadge(issue.severity)}
                            <span className="font-medium text-sm">{issue.category}</span>
                          </div>
                          <p className="text-sm mb-2">{issue.description}</p>
                          <div className="bg-muted p-2 rounded text-xs">
                            <span className="font-medium">Suggestion: </span>
                            {issue.suggestion}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Screenshots Tab */}
        <TabsContent value="screenshots" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {run.screenshotResults?.map((screenshot, idx) => (
              <Card
                key={idx}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedScreenshot(idx)}
              >
                <CardContent className="p-4">
                  <div className="aspect-video bg-muted rounded-lg mb-2 flex items-center justify-center overflow-hidden">
                    <img
                      src={`/api/screenshots/${screenshot.path}`}
                      alt={screenshot.url}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{screenshot.url}</p>
                  <p className="text-xs text-muted-foreground">
                    {screenshot.width}x{screenshot.height}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Pages Tab */}
        <TabsContent value="pages" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scanned Pages</CardTitle>
              <CardDescription>All pages discovered and analyzed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {run.crawlResult?.urls.map((url, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="font-mono text-sm">{url}</span>
                    </div>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Screenshot Lightbox */}
      <AnimatePresence>
        {selectedScreenshot !== null && run.screenshotResults && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedScreenshot(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="max-w-6xl w-full bg-white dark:bg-gray-900 rounded-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b flex items-center justify-between">
                <p className="font-medium">{run.screenshotResults[selectedScreenshot].url}</p>
                <Button variant="ghost" onClick={() => setSelectedScreenshot(null)}>
                  Close
                </Button>
              </div>
              <div className="p-4 max-h-[80vh] overflow-auto">
                <img
                  src={`/api/screenshots/${run.screenshotResults[selectedScreenshot].path}`}
                  alt={run.screenshotResults[selectedScreenshot].url}
                  className="w-full"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
