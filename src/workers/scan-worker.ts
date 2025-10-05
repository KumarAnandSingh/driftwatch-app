import { Worker, Job } from 'bullmq';
import Redis from 'ioredis';
import { prisma } from '../lib/prisma';
import { WebCrawler } from '../lib/scanner/crawler';
import { ScreenshotService } from '../lib/scanner/screenshot';
import { AccessibilityScanner } from '../lib/scanner/accessibility';
import { AICritiqueService } from '../lib/scanner/ai-critique';
import { PerformanceAnalyzer } from '../lib/scanner/performance';
import { SEOScanner } from '../lib/scanner/seo';
import { VisualDiffService } from '../lib/scanner/visual-diff';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  maxRetriesPerRequest: null,
});

interface ScanJobData {
  runId: string;
  projectId: string;
  url: string;
  userEmail?: string; // User email for API key lookup
  config: {
    maxPages: number;
    maxDepth: number;
    scanAccessibility: boolean;
    scanPerformance: boolean;
    scanSeo: boolean;
    scanAiCritique: boolean;
    scanVisualRegression: boolean;
  };
}

class ScanWorker {
  private worker: Worker<ScanJobData>;

  constructor() {
    this.worker = new Worker<ScanJobData>(
      'scans',
      async (job: Job<ScanJobData>) => {
        return await this.processScan(job);
      },
      {
        connection: redis,
        concurrency: 2,
      }
    );

    this.worker.on('completed', (job) => {
      console.log(`✅ Scan ${job.id} completed successfully`);
    });

    this.worker.on('failed', (job, error) => {
      console.error(`❌ Scan ${job?.id} failed:`, error);
    });

    console.log('🚀 Scan worker started');
  }

  private async updateRunProgress(
    runId: string,
    data: {
      progress: number;
      currentPhase: string;
      pagesScanned?: number;
      issuesCritical?: number;
      issuesWarning?: number;
      issuesPassed?: number;
      score?: number;
    }
  ) {
    await prisma.run.update({
      where: { id: runId },
      data: {
        ...data,
        status: 'RUNNING',
      },
    });
  }

  private async processScan(job: Job<ScanJobData>): Promise<void> {
    const { runId, projectId, url, userEmail, config } = job.data;

    console.log(`🚀 Starting scan for ${url} (Run: ${runId})`);

    // Get user's Anthropic API key if available
    let userAnthropicKey: string | null = null;
    if (userEmail) {
      const user = await prisma.user.findUnique({
        where: { email: userEmail },
        select: { anthropicApiKey: true },
      });

      if (user?.anthropicApiKey) {
        try {
          // Import the decryption function
          const { getUserAnthropicKey } = await import('../app/api/settings/api-keys/route');
          userAnthropicKey = await getUserAnthropicKey(userEmail);
        } catch (error) {
          console.error('Error fetching user API key:', error);
        }
      }
    }

    // Initialize services
    const crawler = new WebCrawler();
    const screenshotService = new ScreenshotService();
    const accessibilityScanner = new AccessibilityScanner();
    const aiCritiqueService = new AICritiqueService(userAnthropicKey || undefined);
    const performanceAnalyzer = new PerformanceAnalyzer();
    const seoScanner = new SEOScanner();
    const visualDiffService = new VisualDiffService();

    try {
      // Mark as running
      await this.updateRunProgress(runId, {
        progress: 0,
        currentPhase: 'crawling',
      });

      // ═══════════════════════════════════════════════════════════
      // PHASE 1: WEB CRAWLING (0-20%)
      // ═══════════════════════════════════════════════════════════
      console.log(`📡 [${runId}] Phase 1: Crawling website...`);

      await crawler.initialize();

      const pages = await crawler.crawl({
        seedUrl: url,
        maxDepth: config.maxDepth,
        maxPages: config.maxPages,
      });

      await this.updateRunProgress(runId, {
        progress: 20,
        currentPhase: 'screenshots',
        pagesScanned: pages.length,
      });

      console.log(`✅ [${runId}] Crawled ${pages.length} pages`);

      // ═══════════════════════════════════════════════════════════
      // PHASE 2: SCREENSHOTS (20-40%)
      // ═══════════════════════════════════════════════════════════
      console.log(`📸 [${runId}] Phase 2: Capturing screenshots...`);

      await screenshotService.initialize();

      const screenshots = [];
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const screenshot = await screenshotService.capture({
          url: page.url,
          fullPage: true,
          quality: 90,
        });
        screenshots.push(screenshot);

        // Update progress incrementally
        const progress = 20 + Math.floor((i + 1) / pages.length * 20);
        await this.updateRunProgress(runId, {
          progress,
          currentPhase: 'screenshots',
        });
      }

      console.log(`✅ [${runId}] Captured ${screenshots.length} screenshots`);

      // ═══════════════════════════════════════════════════════════
      // PHASE 3: ACCESSIBILITY (40-60%)
      // ═══════════════════════════════════════════════════════════
      if (config.scanAccessibility) {
        console.log(`♿ [${runId}] Phase 3: Accessibility scanning...`);

        await this.updateRunProgress(runId, {
          progress: 40,
          currentPhase: 'accessibility',
        });

        await accessibilityScanner.initialize();

        const a11yResults = [];
        let totalCritical = 0;
        let totalWarnings = 0;
        let totalPassed = 0;

        for (let i = 0; i < pages.length; i++) {
          const page = pages[i];
          const result = await accessibilityScanner.scan({
            url: page.url,
            standard: 'wcag21aa',
          });

          a11yResults.push(result);

          // Count issues by severity
          result.violations.forEach((v) => {
            if (v.impact === 'critical') totalCritical++;
            else if (v.impact === 'serious' || v.impact === 'moderate') totalWarnings++;
          });

          totalPassed += result.passes;

          // Update progress
          const progress = 40 + Math.floor((i + 1) / pages.length * 20);
          await this.updateRunProgress(runId, {
            progress,
            currentPhase: 'accessibility',
            issuesCritical: totalCritical,
            issuesWarning: totalWarnings,
            issuesPassed: totalPassed,
          });
        }

        // Calculate average accessibility score
        const avgA11yScore = Math.round(
          a11yResults.reduce((sum, r) => sum + r.score, 0) / a11yResults.length
        );

        await prisma.run.update({
          where: { id: runId },
          data: {
            a11yResults: a11yResults as any,
          },
        });

        console.log(`✅ [${runId}] Accessibility scan complete. Avg score: ${avgA11yScore}`);
      }

      // ═══════════════════════════════════════════════════════════
      // PHASE 4: AI CRITIQUE (60-100%)
      // ═══════════════════════════════════════════════════════════
      if (config.scanAiCritique) {
        console.log(`🤖 [${runId}] Phase 4: AI Design Critique...`);

        await this.updateRunProgress(runId, {
          progress: 60,
          currentPhase: 'ai_critique',
        });

        const aiCritiqueResults = [];
        let totalScore = 0;

        for (let i = 0; i < screenshots.length; i++) {
          const screenshot = screenshots[i];
          const pageInfo = pages.find(p => p.url === screenshot.url);

          const aiResult = await aiCritiqueService.critique({
            screenshotPath: screenshot.path,
            url: screenshot.url,
            pageTitle: pageInfo?.title,
          });

          aiCritiqueResults.push(aiResult);
          totalScore += aiResult.score;

          // Update progress
          const progress = 60 + Math.floor((i + 1) / screenshots.length * 35);
          await this.updateRunProgress(runId, {
            progress,
            currentPhase: 'ai_critique',
          });
        }

        const avgAiScore = Math.round(totalScore / aiCritiqueResults.length);

        await prisma.run.update({
          where: { id: runId },
          data: {
            aiCritiqueResults: aiCritiqueResults as any,
          },
        });

        console.log(`✅ [${runId}] AI critique complete. Avg score: ${avgAiScore}`);
      }

      // ═══════════════════════════════════════════════════════════
      // PHASE 5: PERFORMANCE ANALYSIS (60-70%)
      // ═══════════════════════════════════════════════════════════
      if (config.scanPerformance) {
        console.log(`⚡ [${runId}] Phase 5: Performance analysis...`);

        await this.updateRunProgress(runId, {
          progress: 60,
          currentPhase: 'performance',
        });

        await performanceAnalyzer.initialize();

        const perfResults = [];
        let totalPerfScore = 0;

        for (let i = 0; i < pages.length; i++) {
          const page = pages[i];
          const result = await performanceAnalyzer.analyze({
            url: page.url,
          });

          perfResults.push(result);
          totalPerfScore += result.score;

          // Update progress
          const progress = 60 + Math.floor((i + 1) / pages.length * 10);
          await this.updateRunProgress(runId, {
            progress,
            currentPhase: 'performance',
          });
        }

        const avgPerfScore = Math.round(totalPerfScore / perfResults.length);

        await prisma.run.update({
          where: { id: runId },
          data: {
            perfResults: perfResults as any,
          },
        });

        console.log(`✅ [${runId}] Performance analysis complete. Avg score: ${avgPerfScore}`);
      }

      // ═══════════════════════════════════════════════════════════
      // PHASE 6: SEO ANALYSIS (70-80%)
      // ═══════════════════════════════════════════════════════════
      if (config.scanSeo) {
        console.log(`🔍 [${runId}] Phase 6: SEO analysis...`);

        await this.updateRunProgress(runId, {
          progress: 70,
          currentPhase: 'seo',
        });

        await seoScanner.initialize();

        const seoResults = [];
        let totalSeoScore = 0;

        for (let i = 0; i < pages.length; i++) {
          const page = pages[i];
          const result = await seoScanner.scan({
            url: page.url,
          });

          seoResults.push(result);
          totalSeoScore += result.score;

          // Update progress
          const progress = 70 + Math.floor((i + 1) / pages.length * 10);
          await this.updateRunProgress(runId, {
            progress,
            currentPhase: 'seo',
          });
        }

        const avgSeoScore = Math.round(totalSeoScore / seoResults.length);

        await prisma.run.update({
          where: { id: runId },
          data: {
            seoResults: seoResults as any,
          },
        });

        console.log(`✅ [${runId}] SEO analysis complete. Avg score: ${avgSeoScore}`);
      }

      // ═══════════════════════════════════════════════════════════
      // PHASE 7: VISUAL REGRESSION (80-95%)
      // ═══════════════════════════════════════════════════════════
      if (config.scanVisualRegression) {
        console.log(`📷 [${runId}] Phase 7: Visual regression testing...`);

        await this.updateRunProgress(runId, {
          progress: 80,
          currentPhase: 'visual_regression',
        });

        await visualDiffService.initialize();

        // Get previous run for comparison (if exists)
        const previousRun = await prisma.run.findFirst({
          where: {
            projectId,
            status: 'COMPLETED',
            id: { not: runId },
          },
          orderBy: { createdAt: 'desc' },
          select: { screenshotResults: true },
        });

        const visualDiffResults = [];

        if (previousRun?.screenshotResults) {
          const previousScreenshots = previousRun.screenshotResults as any[];

          for (let i = 0; i < screenshots.length; i++) {
            const currentScreenshot = screenshots[i];
            const previousScreenshot = previousScreenshots.find(
              (s: any) => s.url === currentScreenshot.url
            );

            if (previousScreenshot) {
              const diffResult = await visualDiffService.compare({
                baselinePath: previousScreenshot.path,
                currentPath: currentScreenshot.path,
                url: currentScreenshot.url,
              });

              visualDiffResults.push(diffResult);
            }

            // Update progress
            const progress = 80 + Math.floor((i + 1) / screenshots.length * 15);
            await this.updateRunProgress(runId, {
              progress,
              currentPhase: 'visual_regression',
            });
          }

          await prisma.run.update({
            where: { id: runId },
            data: {
              visualDiffResults: visualDiffResults as any,
            },
          });

          console.log(`✅ [${runId}] Visual regression complete. ${visualDiffResults.length} comparisons`);
        } else {
          console.log(`ℹ️  [${runId}] No baseline run found. Skipping visual regression.`);
        }
      }

      // ═══════════════════════════════════════════════════════════
      // FINALIZE (95-100%)
      // ═══════════════════════════════════════════════════════════
      await this.updateRunProgress(runId, {
        progress: 95,
        currentPhase: 'complete',
      });

      // Calculate overall score (weighted average)
      const run = await prisma.run.findUnique({
        where: { id: runId },
      });

      let overallScore = 0;
      let weights = 0;

      if (run?.a11yResults && Array.isArray(run.a11yResults)) {
        const a11yResults = run.a11yResults as any[];
        const avgA11y = a11yResults.reduce((sum, r) => sum + (r.score || 0), 0) / a11yResults.length;
        overallScore += avgA11y * 0.25; // 25% weight
        weights += 0.25;
      }

      if (run?.aiCritiqueResults && Array.isArray(run.aiCritiqueResults)) {
        const aiResults = run.aiCritiqueResults as any[];
        const avgAi = aiResults.reduce((sum, r) => sum + (r.score || 0), 0) / aiResults.length;
        overallScore += avgAi * 0.25; // 25% weight
        weights += 0.25;
      }

      if (run?.perfResults && Array.isArray(run.perfResults)) {
        const perfResults = run.perfResults as any[];
        const avgPerf = perfResults.reduce((sum, r) => sum + (r.score || 0), 0) / perfResults.length;
        overallScore += avgPerf * 0.25; // 25% weight
        weights += 0.25;
      }

      if (run?.seoResults && Array.isArray(run.seoResults)) {
        const seoResults = run.seoResults as any[];
        const avgSeo = seoResults.reduce((sum, r) => sum + (r.score || 0), 0) / seoResults.length;
        overallScore += avgSeo * 0.25; // 25% weight
        weights += 0.25;
      }

      const finalScore = weights > 0 ? Math.round(overallScore / weights) : 75;

      // Save final results
      await prisma.run.update({
        where: { id: runId },
        data: {
          status: 'COMPLETED',
          progress: 100,
          currentPhase: 'complete',
          score: finalScore,
          finishedAt: new Date(),
          crawlResult: {
            pages: pages.length,
            urls: pages.map(p => p.url),
          } as any,
          screenshotResults: screenshots as any,
        },
      });

      console.log(`✅ [${runId}] Scan complete! Final score: ${finalScore}/100`);

      // Cleanup
      await crawler.close();
      await screenshotService.close();
      if (config.scanAccessibility) await accessibilityScanner.close();
      if (config.scanPerformance) await performanceAnalyzer.close();
      if (config.scanSeo) await seoScanner.close();
      if (config.scanVisualRegression) await visualDiffService.close();

    } catch (error) {
      console.error(`❌ [${runId}] Scan failed:`, error);

      await prisma.run.update({
        where: { id: runId },
        data: {
          status: 'FAILED',
          finishedAt: new Date(),
        },
      });

      throw error;
    }
  }

  async close() {
    await this.worker.close();
    await redis.quit();
  }
}

// Start the worker
const worker = new ScanWorker();

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Closing worker...');
  await worker.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received. Closing worker...');
  await worker.close();
  process.exit(0);
});

export default worker;
