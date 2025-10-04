#!/usr/bin/env tsx

/**
 * Test DriftWatch scanner with studyify.in
 * This script demonstrates the complete scanning workflow
 */

import { WebCrawler } from '../src/lib/scanner/crawler';
import { ScreenshotService } from '../src/lib/scanner/screenshot';
import { AccessibilityScanner } from '../src/lib/scanner/accessibility';
import { PerformanceAnalyzer } from '../src/lib/scanner/performance';
import { AICritiqueService } from '../src/lib/scanner/ai-critique';

async function testStudyify() {
  console.log('🚀 DriftWatch Scanner - Testing studyify.in\n');

  const targetUrl = 'https://www.studyify.in/dashboard';

  try {
    // Phase 1: Crawl
    console.log('📡 Phase 1: Crawling website...');
    const crawler = new WebCrawler();
    await crawler.initialize();

    const pages = await crawler.crawl({
      seedUrl: targetUrl,
      maxDepth: 1,  // Only scan dashboard page
      maxPages: 1,
    });

    console.log(`✅ Found ${pages.length} page(s)`);
    pages.forEach(p => console.log(`   - ${p.url}`));
    console.log();

    // Phase 2: Screenshot
    console.log('📸 Phase 2: Capturing screenshot...');
    const screenshotService = new ScreenshotService();
    await screenshotService.initialize();

    const screenshots = await screenshotService.captureMultiple(
      pages.map(p => p.url)
    );

    console.log(`✅ Captured ${screenshots.length} screenshot(s)`);
    screenshots.forEach(s => console.log(`   - ${s.path} (${Math.round(s.size / 1024)}KB)`));
    console.log();

    // Phase 3: Accessibility
    console.log('♿ Phase 3: Running accessibility scan...');
    const accessibilityScanner = new AccessibilityScanner();
    await accessibilityScanner.initialize();

    const a11yResult = await accessibilityScanner.scan({
      url: targetUrl,
      standard: 'wcag21aa',
    });

    console.log(`✅ Accessibility Score: ${a11yResult.score}/100`);
    console.log(`   - Violations: ${a11yResult.violations.length}`);
    console.log(`   - Passes: ${a11yResult.passes}`);

    if (a11yResult.violations.length > 0) {
      console.log('\n   Top 5 Critical Issues:');
      a11yResult.violations
        .filter(v => v.impact === 'critical' || v.impact === 'serious')
        .slice(0, 5)
        .forEach(v => {
          console.log(`   ⚠️  [${v.impact.toUpperCase()}] ${v.id}`);
          console.log(`      ${v.description}`);
        });
    }
    console.log();

    // Phase 4: Performance (skip for now - slow)
    console.log('⚡ Phase 4: Performance analysis...');
    console.log('   ⏭️  Skipping (Lighthouse takes ~30s per page)');
    console.log('   💡 To enable: remove the skip in the script');
    console.log();

    // Uncomment to run performance analysis:
    // const performanceAnalyzer = new PerformanceAnalyzer();
    // await performanceAnalyzer.initialize();
    // const perfResult = await performanceAnalyzer.analyze({ url: targetUrl });
    // console.log(`✅ Performance Score: ${perfResult.score}/100`);
    // console.log(`   - LCP: ${perfResult.metrics.largestContentfulPaint}ms`);
    // console.log(`   - TBT: ${perfResult.metrics.totalBlockingTime}ms`);
    // console.log(`   - CLS: ${perfResult.metrics.cumulativeLayoutShift}`);

    // Phase 5: AI Critique
    console.log('🤖 Phase 5: AI Design Critique...');

    if (!process.env.ANTHROPIC_API_KEY) {
      console.log('   ⏭️  Skipping (ANTHROPIC_API_KEY not set)');
      console.log('   💡 To enable: export ANTHROPIC_API_KEY=sk-ant-...');
    } else {
      const aiCritiqueService = new AICritiqueService();
      const aiResult = await aiCritiqueService.critique({
        screenshotPath: screenshots[0].path,
        url: targetUrl,
        pageTitle: pages[0].title,
      });

      console.log(`✅ AI Design Score: ${aiResult.score}/100`);
      console.log(`   Summary: ${aiResult.summary}`);

      if (aiResult.insights.length > 0) {
        console.log('\n   Top Insights:');
        aiResult.insights.slice(0, 3).forEach(insight => {
          console.log(`   📌 [${insight.category}] ${insight.title}`);
          console.log(`      Severity: ${insight.severity.toUpperCase()}`);
          console.log(`      ${insight.description}`);
          console.log(`      💡 ${insight.suggestion}`);
        });
      }
    }
    console.log();

    // Summary
    console.log('━'.repeat(60));
    console.log('📊 SCAN SUMMARY');
    console.log('━'.repeat(60));
    console.log(`✅ Pages Scanned: ${pages.length}`);
    console.log(`✅ Screenshots Captured: ${screenshots.length}`);
    console.log(`✅ Accessibility Score: ${a11yResult.score}/100`);
    console.log(`✅ Total Violations: ${a11yResult.violations.length}`);
    console.log('━'.repeat(60));
    console.log();

    console.log('🎉 DriftWatch scan completed successfully!');
    console.log(`📁 Screenshots saved to: ${screenshots[0].path.split('/').slice(0, -1).join('/')}`);

    // Cleanup
    await crawler.close();
    await screenshotService.close();
    await accessibilityScanner.close();

  } catch (error) {
    console.error('\n❌ Scan failed:', error);
    process.exit(1);
  }
}

// Run the test
testStudyify().then(() => process.exit(0));
