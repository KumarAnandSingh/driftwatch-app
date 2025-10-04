'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Copy,
  Check,
  Code,
  Wand2,
  X,
  Crown,
  ArrowRight,
  FileCode,
  Zap,
} from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface Fix {
  id: string;
  title: string;
  category: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
  originalCode: string;
  fixedCode: string;
  explanation: string;
  impact: string;
}

interface FixItForMeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  issues: Array<{
    id: string;
    title: string;
    category: string;
    severity: string;
    description: string;
  }>;
  isPremium?: boolean;
}

export function FixItForMeDialog({ open, onOpenChange, issues, isPremium = false }: FixItForMeDialogProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [fixes, setFixes] = useState<Fix[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [error, setError] = useState<string | null>(null);

  // Real AI fix generation
  const generateFixes = async () => {
    if (!isPremium) {
      return; // Show paywall instead
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    setError(null);

    try {
      // Simulate progressive generation for UX
      const progressInterval = setInterval(() => {
        setGenerationProgress((prev) => Math.min(prev + 10, 90));
      }, 500);

      // Call the real API
      const response = await fetch('/api/fixes/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          issues: issues.map(issue => ({
            id: issue.id,
            title: issue.title,
            category: issue.category,
            severity: issue.severity,
            description: issue.description,
          })),
          url: typeof window !== 'undefined' ? window.location.href : '',
        }),
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate fixes');
      }

      const data = await response.json();
      setFixes(data.fixes);
      setGenerationProgress(100);
    } catch (err) {
      console.error('Error generating fixes:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate fixes');
      setGenerationProgress(0);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (code: string, id: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredFixes = activeTab === 'all'
    ? fixes
    : fixes.filter(fix => fix.severity === activeTab);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="h-6 w-6 text-primary" />
            Fix It For Me - AI Code Generator
          </DialogTitle>
          <DialogDescription>
            Let DriftWatch AI generate code fixes for all your issues automatically
          </DialogDescription>
        </DialogHeader>

        {!isPremium ? (
          // Paywall UI
          <div className="space-y-6 py-8">
            <div className="text-center space-y-4">
              <div className="h-20 w-20 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center mx-auto">
                <Crown className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold">Unlock AI-Powered Fixes</h3>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Get instant AI-generated code snippets that fix all your accessibility,
                design, and performance issues automatically.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">Smart Code Generation</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    AI-powered fixes for accessibility, SEO, and performance issues
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Wand2 className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">One-Click Apply</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Copy optimized code snippets with explanations and best practices
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <FileCode className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">Before/After Comparison</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    See exactly what changed with side-by-side code diffs
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">Instant Results</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Generate fixes for all {issues.length} issues in seconds
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Pricing */}
            <div className="max-w-md mx-auto">
              <Card className="border-primary bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">DriftWatch Pro</CardTitle>
                  <CardDescription>
                    <span className="text-3xl font-bold text-foreground">$29</span>
                    <span className="text-muted-foreground">/month</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      Unlimited AI code fixes
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      Priority support
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      Advanced analytics
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      Scheduled monitoring
                    </li>
                  </ul>

                  <Button size="lg" className="w-full gap-2">
                    <Crown className="h-5 w-5" />
                    Upgrade to Pro
                    <ArrowRight className="h-4 w-4" />
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    7-day money-back guarantee • Cancel anytime
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          // Premium User - Show Fixes
          <div className="space-y-6">
            {fixes.length === 0 ? (
              // Generation UI
              <div className="text-center space-y-6 py-12">
                {error ? (
                  <>
                    <div className="h-20 w-20 rounded-full bg-red-100 dark:bg-red-950/20 flex items-center justify-center mx-auto">
                      <XCircle className="h-10 w-10 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-red-600">Generation Failed</h3>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        {error}
                      </p>
                    </div>
                    <Button size="lg" onClick={generateFixes} className="gap-2">
                      <Sparkles className="h-5 w-5" />
                      Try Again
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </>
                ) : !isGenerating ? (
                  <>
                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <Wand2 className="h-10 w-10 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Ready to Generate Fixes</h3>
                      <p className="text-muted-foreground">
                        DriftWatch AI will analyze {issues.length} issues and generate optimized code fixes
                      </p>
                    </div>
                    <Button size="lg" onClick={generateFixes} className="gap-2">
                      <Sparkles className="h-5 w-5" />
                      Generate AI Fixes
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="relative h-20 w-20 mx-auto">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="h-20 w-20 rounded-full border-4 border-primary/20 border-t-primary"
                      />
                      <Sparkles className="h-8 w-8 text-primary absolute inset-0 m-auto" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Generating Fixes...</h3>
                      <p className="text-muted-foreground mb-4">
                        AI is analyzing your code and creating optimized fixes
                      </p>
                      <div className="max-w-md mx-auto">
                        <Progress value={generationProgress} className="h-2" />
                        <p className="text-sm text-muted-foreground mt-2">
                          {generationProgress}% complete
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              // Show Generated Fixes
              <>
                {/* Header Stats */}
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <h3 className="font-semibold">
                      {fixes.length} AI-Generated Fixes Ready
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Click any fix to see code and apply changes
                    </p>
                  </div>
                  <Badge className="bg-green-500">
                    <Check className="h-4 w-4 mr-1" />
                    All Generated
                  </Badge>
                </div>

                {/* Filters */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList>
                    <TabsTrigger value="all">
                      All ({fixes.length})
                    </TabsTrigger>
                    <TabsTrigger value="high">
                      High ({fixes.filter(f => f.severity === 'high').length})
                    </TabsTrigger>
                    <TabsTrigger value="medium">
                      Medium ({fixes.filter(f => f.severity === 'medium').length})
                    </TabsTrigger>
                    <TabsTrigger value="low">
                      Low ({fixes.filter(f => f.severity === 'low').length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value={activeTab} className="space-y-4 mt-4">
                    {filteredFixes.map((fix) => (
                      <Card key={fix.id}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-base flex items-center gap-2">
                                {fix.title}
                                <Badge
                                  className={
                                    fix.severity === 'high'
                                      ? 'bg-red-500'
                                      : fix.severity === 'medium'
                                      ? 'bg-yellow-500'
                                      : 'bg-blue-500'
                                  }
                                >
                                  {fix.severity}
                                </Badge>
                              </CardTitle>
                              <CardDescription>{fix.description}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Code Comparison */}
                          <div className="grid md:grid-cols-2 gap-4">
                            {/* Before */}
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-red-600">Before</span>
                                <X className="h-4 w-4 text-red-600" />
                              </div>
                              <pre className="text-xs bg-red-50 dark:bg-red-950/20 p-3 rounded border border-red-200 overflow-x-auto">
                                <code>{fix.originalCode}</code>
                              </pre>
                            </div>

                            {/* After */}
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-green-600">After</span>
                                <Check className="h-4 w-4 text-green-600" />
                              </div>
                              <pre className="text-xs bg-green-50 dark:bg-green-950/20 p-3 rounded border border-green-200 overflow-x-auto">
                                <code>{fix.fixedCode}</code>
                              </pre>
                            </div>
                          </div>

                          {/* Explanation */}
                          <div className="bg-muted/50 p-3 rounded">
                            <h5 className="text-sm font-semibold mb-1">What Changed:</h5>
                            <p className="text-sm text-muted-foreground">{fix.explanation}</p>
                          </div>

                          {/* Impact */}
                          <div className="flex items-start gap-2 text-sm">
                            <Zap className="h-4 w-4 text-yellow-600 mt-0.5" />
                            <div>
                              <span className="font-medium">Impact: </span>
                              <span className="text-muted-foreground">{fix.impact}</span>
                            </div>
                          </div>

                          {/* Copy Button */}
                          <Button
                            onClick={() => copyToClipboard(fix.fixedCode, fix.id)}
                            className="w-full gap-2"
                            variant={copiedId === fix.id ? 'secondary' : 'default'}
                          >
                            {copiedId === fix.id ? (
                              <>
                                <Check className="h-4 w-4" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="h-4 w-4" />
                                Copy Fixed Code
                              </>
                            )}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>
                </Tabs>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
