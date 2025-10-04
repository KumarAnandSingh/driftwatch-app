#!/usr/bin/env node

/**
 * QUICK DriftWatch Scanner Test
 * Tests crawler, screenshots, accessibility, and AI critique
 * Skips performance (Lighthouse) due to tsx/node compatibility issues
 */

import 'dotenv/config';
import { WebCrawler } from '../src/lib/scanner/crawler.ts';
import { ScreenshotService } from '../src/lib/scanner/screenshot.ts';
import { AccessibilityScanner } from '../src/lib/scanner/accessibility.ts';
import { AICritiqueService } from '../src/lib/scanner/ai-critique.ts';
import { writeFile } from 'fs/promises';
import { join } from 'path';

async function quickTest() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║   DRIFTWATCH - QUICK SCANNER TEST (NO PERFORMANCE)         ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  const targetUrl = 'https://www.studyify.in';
  const results = {
    crawl: null,
    screenshots: [],
    accessibility: [],
    aiCritique: [],
    errors: []
  };

  const startTime = Date.now();

  try {
    // PHASE 1: WEB CRAWLING
    console.log('━'.repeat(60));
    console.log('📡 PHASE 1: WEB CRAWLING');
    console.log('━'.repeat(60));
    console.log(`Target: ${targetUrl}`);
    console.log(`Max Depth: 2`);
    console.log(`Max Pages: 10\n`);

    const crawler = new WebCrawler();
    await crawler.initialize();

    const phaseStart = Date.now();
    const pages = await crawler.crawl({
      seedUrl: targetUrl,
      maxDepth: 2,
      maxPages: 10,
    });
    const phaseTime = ((Date.now() - phaseStart) / 1000).toFixed(2);

    results.crawl = { pages: pages.length, time: phaseTime };

    console.log(`✅ CRAWLING COMPLETE (${phaseTime}s)`);
    console.log(`📊 Pages discovered: ${pages.length}\n`);
    pages.forEach((p, i) => {
      console.log(`   ${i + 1}. [Depth ${p.depth}] ${p.url}`);
      console.log(`      Title: ${p.title || 'No title'}`);
      console.log(`      Links found: ${p.links.length}`);
    });
    console.log();

    // PHASE 2: SCREENSHOTS
    console.log('━'.repeat(60));
    console.log('📸 PHASE 2: SCREENSHOT CAPTURE');
    console.log('━'.repeat(60));
    console.log(`Capturing ${pages.length} screenshots...\n`);

    const screenshotService = new ScreenshotService();
    await screenshotService.initialize();

    const phaseStart2 = Date.now();
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      console.log(`📸 [${i + 1}/${pages.length}] Capturing: ${page.url}`);
      try {
        const screenshot = await screenshotService.capture({
          url: page.url,
          fullPage: true,
          quality: 90
        });
        results.screenshots.push(screenshot);
        console.log(`   ✅ Saved: ${screenshot.path.split('/').pop()} (${Math.round(screenshot.size / 1024)}KB)`);
      } catch (error) {
        console.log(`   ❌ Failed: ${error.message}`);
        results.errors.push(`Screenshot ${page.url}: ${error.message}`);
      }
    }
    const phaseTime2 = ((Date.now() - phaseStart2) / 1000).toFixed(2);
    console.log(`\n✅ SCREENSHOTS COMPLETE (${phaseTime2}s)`);
    console.log(`📊 Total captured: ${results.screenshots.length}/${pages.length}\n`);

    // PHASE 3: ACCESSIBILITY
    console.log('━'.repeat(60));
    console.log('♿ PHASE 3: ACCESSIBILITY SCANNING');
    console.log('━'.repeat(60));
    console.log(`Scanning ${pages.length} pages for WCAG 2.1 AA compliance...\n`);

    const accessibilityScanner = new AccessibilityScanner();
    await accessibilityScanner.initialize();

    const phaseStart3 = Date.now();
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      console.log(`♿ [${i + 1}/${pages.length}] Scanning: ${page.url}`);
      try {
        const a11yResult = await accessibilityScanner.scan({
          url: page.url,
          standard: 'wcag21aa',
        });
        results.accessibility.push(a11yResult);

        console.log(`   ✅ Score: ${a11yResult.score}/100`);
        console.log(`   📊 Violations: ${a11yResult.violations.length} | Passes: ${a11yResult.passes}`);

        if (a11yResult.violations.length > 0) {
          const critical = a11yResult.violations.filter(v => v.impact === 'critical').length;
          const serious = a11yResult.violations.filter(v => v.impact === 'serious').length;
          const moderate = a11yResult.violations.filter(v => v.impact === 'moderate').length;
          const minor = a11yResult.violations.filter(v => v.impact === 'minor').length;

          console.log(`   ⚠️  Critical: ${critical} | Serious: ${serious} | Moderate: ${moderate} | Minor: ${minor}`);
        }
      } catch (error) {
        console.log(`   ❌ Failed: ${error.message}`);
        results.errors.push(`Accessibility ${page.url}: ${error.message}`);
      }
    }
    const phaseTime3 = ((Date.now() - phaseStart3) / 1000).toFixed(2);
    console.log(`\n✅ ACCESSIBILITY COMPLETE (${phaseTime3}s)\n`);

    // PHASE 4: AI DESIGN CRITIQUE
    console.log('━'.repeat(60));
    console.log('🤖 PHASE 4: AI DESIGN CRITIQUE (Claude Sonnet 3.5)');
    console.log('━'.repeat(60));

    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY.includes('your-key-here')) {
      console.log('❌ ANTHROPIC_API_KEY not configured');
      console.log('   Please set a valid API key in .env file\n');
    } else {
      console.log(`Analyzing ${results.screenshots.length} screenshots with AI...\n`);

      const aiCritiqueService = new AICritiqueService();

      const phaseStart4 = Date.now();
      for (let i = 0; i < results.screenshots.length; i++) {
        const screenshot = results.screenshots[i];
        const pageInfo = pages.find(p => screenshot.url === p.url);

        console.log(`🤖 [${i + 1}/${results.screenshots.length}] Critiquing: ${screenshot.url}`);
        try {
          const aiResult = await aiCritiqueService.critique({
            screenshotPath: screenshot.path,
            url: screenshot.url,
            pageTitle: pageInfo?.title,
          });
          results.aiCritique.push(aiResult);

          console.log(`   ✅ AI Design Score: ${aiResult.score}/100`);
          console.log(`   📝 ${aiResult.summary}`);
          console.log(`   📊 Insights: ${aiResult.insights.length} | Strengths: ${aiResult.strengths.length} | Improvements: ${aiResult.improvements.length}`);

          if (aiResult.insights.length > 0) {
            console.log(`   🔍 Top Issue: [${aiResult.insights[0].category}] ${aiResult.insights[0].title}`);
          }
        } catch (error) {
          console.log(`   ❌ Failed: ${error.message}`);
          results.errors.push(`AI Critique ${screenshot.url}: ${error.message}`);
        }
      }
      const phaseTime4 = ((Date.now() - phaseStart4) / 1000).toFixed(2);
      console.log(`\n✅ AI CRITIQUE COMPLETE (${phaseTime4}s)\n`);
    }

    // FINAL REPORT
    const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log('\n');
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║                    FINAL SCAN REPORT                       ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    console.log('📊 OVERALL STATISTICS');
    console.log('━'.repeat(60));
    console.log(`⏱️  Total Scan Time: ${totalTime}s`);
    console.log(`🌐 Pages Crawled: ${pages.length}`);
    console.log(`📸 Screenshots Captured: ${results.screenshots.length}/${pages.length}`);
    console.log(`♿ Accessibility Scans: ${results.accessibility.length}/${pages.length}`);
    console.log(`🤖 AI Critiques: ${results.aiCritique.length}/${results.screenshots.length}`);
    console.log(`❌ Errors Encountered: ${results.errors.length}\n`);

    // Save detailed report
    const reportPath = join(process.cwd(), 'test-report.json');
    await writeFile(reportPath, JSON.stringify(results, null, 2));
    console.log(`📄 Detailed report saved: ${reportPath}\n`);

    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║              ✅ QUICK TEST FINISHED                        ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    // Cleanup
    await crawler.close();
    await screenshotService.close();
    await accessibilityScanner.close();

  } catch (error) {
    console.error('\n❌ CRITICAL ERROR:', error);
    process.exit(1);
  }
}

// Run the test
quickTest().then(() => process.exit(0));
