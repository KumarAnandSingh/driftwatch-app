import { Worker, Job } from 'bullmq';
import { redis } from '../lib/redis';
import { WebCrawler } from '../lib/scanner/crawler';
import { ScreenshotService } from '../lib/scanner/screenshot';
import { AccessibilityScanner } from '../lib/scanner/accessibility';
import { PerformanceAnalyzer } from '../lib/scanner/performance';
import { VisualDiffService } from '../lib/scanner/visual-diff';
import { AICritiqueService } from '../lib/scanner/ai-critique';
import { db } from '../db';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export interface RunJobData {
  runId: string;
  projectId: string;
  seedUrl: string;
  maxDepth?: number;
  maxPages?: number;
  enableAccessibility?: boolean;
  enablePerformance?: boolean;
  enableVisualRegression?: boolean;
  enableAICritique?: boolean;
}

interface ScanProgress {
  phase: string;
  progress: number;
  message: string;
}

export class DriftWatchWorker {
  private worker: Worker<RunJobData>;

  constructor() {
    this.worker = new Worker<RunJobData>(
      'driftwatch-run',
      async (job: Job<RunJobData>) => {
        return await this.processRun(job);
      },
      {
        connection: redis,
        concurrency: 2, // Process 2 scans concurrently
      }
    );

    this.worker.on('completed', (job) => {
      console.log(`✅ Job ${job.id} completed successfully`);
    });

    this.worker.on('failed', (job, error) => {
      console.error(`❌ Job ${job?.id} failed:`, error);
    });
  }

  private async updateProgress(job: Job<RunJobData>, update: ScanProgress) {
    await job.updateProgress(update.progress);
    await job.log(`[${update.phase}] ${update.message}`);
    console.log(`📊 [${job.data.runId}] ${update.phase}: ${update.message} (${update.progress}%)`);
  }

  private async processRun(job: Job<RunJobData>): Promise<any> {
    const {
      runId,
      projectId,
      seedUrl,
      maxDepth = 2,
      maxPages = 20,
      enableAccessibility = true,
      enablePerformance = true,
      enableVisualRegression = true,
      enableAICritique = true,
    } = job.data;

    console.log(`🚀 Starting scan for ${seedUrl}`);

    const crawler = new WebCrawler();
    const screenshotService = new ScreenshotService();
    const accessibilityScanner = new AccessibilityScanner();
    const performanceAnalyzer = new PerformanceAnalyzer();
    const visualDiffService = new VisualDiffService();
    const aiCritiqueService = new AICritiqueService();

    try {
      // Update run status to running
      await db.run.update({
        where: { id: runId },
        data: { status: 'running' },
      });

      // Phase 1: Crawl website (0-20%)
      await this.updateProgress(job, {
        phase: 'crawl',
        progress: 5,
        message: `Crawling ${seedUrl}...`,
      });

      await crawler.initialize();
      const pages = await crawler.crawl({
        seedUrl,
        maxDepth,
        maxPages,
      });

      await this.updateProgress(job, {
        phase: 'crawl',
        progress: 20,
        message: `Found ${pages.length} pages`,
      });

      // Phase 2: Capture screenshots (20-40%)
      await this.updateProgress(job, {
        phase: 'screenshots',
        progress: 25,
        message: 'Capturing screenshots...',
      });

      await screenshotService.initialize();
      const screenshots = await screenshotService.captureMultiple(
        pages.map((p) => p.url)
      );

      await this.updateProgress(job, {
        phase: 'screenshots',
        progress: 40,
        message: `Captured ${screenshots.length} screenshots`,
      });

      // Phase 3: Accessibility scanning (40-55%)
      const accessibilityResults: any[] = [];
      if (enableAccessibility) {
        await this.updateProgress(job, {
          phase: 'accessibility',
          progress: 45,
          message: 'Running accessibility scans...',
        });

        await accessibilityScanner.initialize();
        for (let i = 0; i < pages.length; i++) {
          const result = await accessibilityScanner.scan({ url: pages[i].url });
          accessibilityResults.push(result);
          const progress = 45 + Math.round((i / pages.length) * 10);
          await job.updateProgress(progress);
        }

        await this.updateProgress(job, {
          phase: 'accessibility',
          progress: 55,
          message: `Scanned ${accessibilityResults.length} pages for accessibility`,
        });
      }

      // Phase 4: Performance analysis (55-70%)
      const performanceResults: any[] = [];
      if (enablePerformance) {
        await this.updateProgress(job, {
          phase: 'performance',
          progress: 60,
          message: 'Analyzing performance...',
        });

        await performanceAnalyzer.initialize();
        // Only analyze first 5 pages for performance (Lighthouse is slow)
        const pagesToAnalyze = pages.slice(0, 5);
        for (let i = 0; i < pagesToAnalyze.length; i++) {
          try {
            const result = await performanceAnalyzer.analyze({ url: pagesToAnalyze[i].url });
            performanceResults.push(result);
          } catch (error) {
            console.error(`Performance analysis failed for ${pagesToAnalyze[i].url}:`, error);
          }
          const progress = 60 + Math.round((i / pagesToAnalyze.length) * 10);
          await job.updateProgress(progress);
        }

        await this.updateProgress(job, {
          phase: 'performance',
          progress: 70,
          message: `Analyzed ${performanceResults.length} pages for performance`,
        });
      }

      // Phase 5: Visual regression (70-85%)
      const visualDiffResults: any[] = [];
      if (enableVisualRegression) {
        await this.updateProgress(job, {
          phase: 'visual-regression',
          progress: 75,
          message: 'Checking for visual regressions...',
        });

        // Get baselines from database
        const baselines = await db.baseline.findMany({
          where: { projectId },
        });

        for (const screenshot of screenshots) {
          const baseline = baselines.find((b) =>
            screenshot.path.includes(b.path.replace(/[^a-z0-9]/gi, '_'))
          );

          if (baseline) {
            const result = await visualDiffService.compare({
              baselineImagePath: baseline.imageUrl,
              currentImagePath: screenshot.path,
            });
            visualDiffResults.push(result);
          }
        }

        await this.updateProgress(job, {
          phase: 'visual-regression',
          progress: 85,
          message: `Compared ${visualDiffResults.length} screenshots`,
        });
      }

      // Phase 6: AI Critique (85-95%)
      const aiCritiqueResults: any[] = [];
      if (enableAICritique) {
        await this.updateProgress(job, {
          phase: 'ai-critique',
          progress: 90,
          message: 'Generating AI design critiques...',
        });

        // Only critique first 3 pages (AI is expensive)
        const pagesToCritique = screenshots.slice(0, 3);
        for (const screenshot of pagesToCritique) {
          const pageInfo = pages.find((p) => screenshot.path.includes(p.url.replace(/[^a-z0-9]/gi, '_')));
          const result = await aiCritiqueService.critique({
            screenshotPath: screenshot.path,
            url: screenshot.url,
            pageTitle: pageInfo?.title,
          });
          aiCritiqueResults.push(result);
        }

        await this.updateProgress(job, {
          phase: 'ai-critique',
          progress: 95,
          message: `Generated ${aiCritiqueResults.length} AI critiques`,
        });
      }

      // Phase 7: Generate summary report (95-100%)
      await this.updateProgress(job, {
        phase: 'summary',
        progress: 97,
        message: 'Generating summary report...',
      });

      const summary = this.generateSummary({
        pages,
        screenshots,
        accessibilityResults,
        performanceResults,
        visualDiffResults,
        aiCritiqueResults,
      });

      // Save summary to database
      await db.run.update({
        where: { id: runId },
        data: {
          status: 'completed',
          finishedAt: new Date(),
          summaryJson: summary as any,
        },
      });

      // Save artifacts
      for (const screenshot of screenshots) {
        await db.artifact.create({
          data: {
            runId,
            type: 'screenshot',
            url: screenshot.path.replace(process.cwd() + '/public', ''),
            size: screenshot.size,
          },
        });
      }

      await this.updateProgress(job, {
        phase: 'completed',
        progress: 100,
        message: '✅ Scan completed successfully!',
      });

      return summary;
    } catch (error: any) {
      console.error('Scan failed:', error);

      await db.run.update({
        where: { id: runId },
        data: {
          status: 'failed',
          finishedAt: new Date(),
          summaryJson: { error: error.message } as any,
        },
      });

      throw error;
    } finally {
      // Cleanup
      await crawler.close();
      await screenshotService.close();
      await accessibilityScanner.close();
      await performanceAnalyzer.close();
    }
  }

  private generateSummary(data: any) {
    const avgAccessibilityScore =
      data.accessibilityResults.length > 0
        ? Math.round(
            data.accessibilityResults.reduce((sum: number, r: any) => sum + r.score, 0) /
              data.accessibilityResults.length
          )
        : 0;

    const avgPerformanceScore =
      data.performanceResults.length > 0
        ? Math.round(
            data.performanceResults.reduce((sum: number, r: any) => sum + r.score, 0) /
              data.performanceResults.length
          )
        : 0;

    const visualRegressionsPassed = data.visualDiffResults.filter((r: any) => r.passed).length;
    const visualRegressionsTotal = data.visualDiffResults.length;

    const avgAICritiqueScore =
      data.aiCritiqueResults.length > 0
        ? Math.round(
            data.aiCritiqueResults.reduce((sum: number, r: any) => sum + r.score, 0) /
              data.aiCritiqueResults.length
          )
        : 0;

    return {
      pagesScanned: data.pages.length,
      screenshotsCaptured: data.screenshots.length,
      accessibility: {
        score: avgAccessibilityScore,
        totalViolations: data.accessibilityResults.reduce(
          (sum: number, r: any) => sum + r.violations.length,
          0
        ),
        criticalViolations: data.accessibilityResults.reduce(
          (sum: number, r: any) => sum + r.violations.filter((v: any) => v.impact === 'critical').length,
          0
        ),
      },
      performance: {
        score: avgPerformanceScore,
        avgLCP: data.performanceResults.length > 0
          ? Math.round(
              data.performanceResults.reduce((sum: number, r: any) => sum + r.metrics.largestContentfulPaint, 0) /
                data.performanceResults.length
            )
          : 0,
      },
      visualRegression: {
        passed: visualRegressionsPassed,
        total: visualRegressionsTotal,
        regressions: visualRegressionsTotal - visualRegressionsPassed,
      },
      aiCritique: {
        score: avgAICritiqueScore,
        totalInsights: data.aiCritiqueResults.reduce(
          (sum: number, r: any) => sum + r.insights.length,
          0
        ),
      },
      timestamp: new Date(),
    };
  }

  async close() {
    await this.worker.close();
  }
}

// Start worker if running as standalone script
if (require.main === module) {
  console.log('🔧 Starting DriftWatch Worker...');
  const worker = new DriftWatchWorker();

  process.on('SIGTERM', async () => {
    console.log('Shutting down worker...');
    await worker.close();
    process.exit(0);
  });
}
