#!/usr/bin/env tsx
/**
 * COMPLETE DriftWatch Scanner Test
 * Tests ALL features with FULL crawling - NO SKIPPING
 */
import { WebCrawler } from '../src/lib/scanner/crawler';
import { ScreenshotService } from '../src/lib/scanner/screenshot';
import { AccessibilityScanner } from '../src/lib/scanner/accessibility';
import { PerformanceAnalyzer } from '../src/lib/scanner/performance';
import { AICritiqueService } from '../src/lib/scanner/ai-critique';
import { writeFile } from 'fs/promises';
import { join } from 'path';
async function comprehensiveTest() {
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║   DRIFTWATCH - COMPLETE SCANNER TEST (NO SKIPPING)         ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');
    const targetUrl = 'https://www.studyify.in';
    const results = {
        crawl: null,
        screenshots: [],
        accessibility: [],
        performance: [],
        visualDiff: [],
        aiCritique: [],
        errors: []
    };
    const startTime = Date.now();
    try {
        // ═══════════════════════════════════════════════════════════
        // PHASE 1: WEB CRAWLING (FULL DEPTH)
        // ═══════════════════════════════════════════════════════════
        console.log('━'.repeat(60));
        console.log('📡 PHASE 1: WEB CRAWLING');
        console.log('━'.repeat(60));
        console.log(`Target: ${targetUrl}`);
        console.log(`Max Depth: 2 (crawl all linked pages)`);
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
        // ═══════════════════════════════════════════════════════════
        // PHASE 2: SCREENSHOT CAPTURE (ALL PAGES)
        // ═══════════════════════════════════════════════════════════
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
            }
            catch (error) {
                console.log(`   ❌ Failed: ${error.message}`);
                results.errors.push(`Screenshot ${page.url}: ${error.message}`);
            }
        }
        const phaseTime2 = ((Date.now() - phaseStart2) / 1000).toFixed(2);
        console.log(`\n✅ SCREENSHOTS COMPLETE (${phaseTime2}s)`);
        console.log(`📊 Total captured: ${results.screenshots.length}/${pages.length}\n`);
        // ═══════════════════════════════════════════════════════════
        // PHASE 3: ACCESSIBILITY SCANNING (ALL PAGES)
        // ═══════════════════════════════════════════════════════════
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
            }
            catch (error) {
                console.log(`   ❌ Failed: ${error.message}`);
                results.errors.push(`Accessibility ${page.url}: ${error.message}`);
            }
        }
        const phaseTime3 = ((Date.now() - phaseStart3) / 1000).toFixed(2);
        console.log(`\n✅ ACCESSIBILITY COMPLETE (${phaseTime3}s)\n`);
        // ═══════════════════════════════════════════════════════════
        // PHASE 4: PERFORMANCE ANALYSIS (ALL PAGES - NO SKIP!)
        // ═══════════════════════════════════════════════════════════
        console.log('━'.repeat(60));
        console.log('⚡ PHASE 4: PERFORMANCE ANALYSIS (Lighthouse)');
        console.log('━'.repeat(60));
        console.log(`Analyzing ${pages.length} pages with Lighthouse...\n`);
        console.log('⏰ Note: This will take ~30-60s per page\n');
        const performanceAnalyzer = new PerformanceAnalyzer();
        await performanceAnalyzer.initialize();
        const phaseStart4 = Date.now();
        for (let i = 0; i < pages.length; i++) {
            const page = pages[i];
            console.log(`⚡ [${i + 1}/${pages.length}] Analyzing: ${page.url}`);
            try {
                const perfResult = await performanceAnalyzer.analyze({
                    url: page.url,
                    formFactor: 'desktop',
                });
                results.performance.push(perfResult);
                console.log(`   ✅ Performance Score: ${perfResult.score}/100`);
                console.log(`   📊 LCP: ${Math.round(perfResult.metrics.largestContentfulPaint)}ms`);
                console.log(`   📊 TBT: ${Math.round(perfResult.metrics.totalBlockingTime)}ms`);
                console.log(`   📊 CLS: ${perfResult.metrics.cumulativeLayoutShift.toFixed(3)}`);
                console.log(`   📊 Categories: Perf=${perfResult.categories.performance} A11y=${perfResult.categories.accessibility} SEO=${perfResult.categories.seo}`);
            }
            catch (error) {
                console.log(`   ❌ Failed: ${error.message}`);
                results.errors.push(`Performance ${page.url}: ${error.message}`);
            }
        }
        const phaseTime4 = ((Date.now() - phaseStart4) / 1000).toFixed(2);
        console.log(`\n✅ PERFORMANCE COMPLETE (${phaseTime4}s)\n`);
        // ═══════════════════════════════════════════════════════════
        // PHASE 5: AI DESIGN CRITIQUE (ALL SCREENSHOTS)
        // ═══════════════════════════════════════════════════════════
        console.log('━'.repeat(60));
        console.log('🤖 PHASE 5: AI DESIGN CRITIQUE (Claude Sonnet 3.5)');
        console.log('━'.repeat(60));
        if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY.includes('your-key-here')) {
            console.log('❌ ANTHROPIC_API_KEY not configured');
            console.log('   Please set a valid API key in .env file\n');
        }
        else {
            console.log(`Analyzing ${results.screenshots.length} screenshots with AI...\n`);
            const aiCritiqueService = new AICritiqueService();
            const phaseStart5 = Date.now();
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
                }
                catch (error) {
                    console.log(`   ❌ Failed: ${error.message}`);
                    results.errors.push(`AI Critique ${screenshot.url}: ${error.message}`);
                }
            }
            const phaseTime5 = ((Date.now() - phaseStart5) / 1000).toFixed(2);
            console.log(`\n✅ AI CRITIQUE COMPLETE (${phaseTime5}s)\n`);
        }
        // ═══════════════════════════════════════════════════════════
        // FINAL REPORT
        // ═══════════════════════════════════════════════════════════
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
        console.log(`⚡ Performance Analyses: ${results.performance.length}/${pages.length}`);
        console.log(`🤖 AI Critiques: ${results.aiCritique.length}/${results.screenshots.length}`);
        console.log(`❌ Errors Encountered: ${results.errors.length}\n`);
        // Accessibility Summary
        if (results.accessibility.length > 0) {
            const avgA11yScore = Math.round(results.accessibility.reduce((sum, r) => sum + r.score, 0) / results.accessibility.length);
            const totalViolations = results.accessibility.reduce((sum, r) => sum + r.violations.length, 0);
            console.log('♿ ACCESSIBILITY SUMMARY');
            console.log('━'.repeat(60));
            console.log(`Average Score: ${avgA11yScore}/100`);
            console.log(`Total Violations: ${totalViolations}`);
            results.accessibility.forEach((r, i) => {
                console.log(`\n${i + 1}. ${r.url}`);
                console.log(`   Score: ${r.score}/100 | Violations: ${r.violations.length}`);
                if (r.violations.length > 0) {
                    const criticalIssues = r.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious');
                    if (criticalIssues.length > 0) {
                        console.log(`   Top Issues:`);
                        criticalIssues.slice(0, 3).forEach((v) => {
                            console.log(`   - [${v.impact.toUpperCase()}] ${v.id}: ${v.description}`);
                        });
                    }
                }
            });
            console.log();
        }
        // Performance Summary
        if (results.performance.length > 0) {
            const avgPerfScore = Math.round(results.performance.reduce((sum, r) => sum + r.score, 0) / results.performance.length);
            const avgLCP = Math.round(results.performance.reduce((sum, r) => sum + r.metrics.largestContentfulPaint, 0) / results.performance.length);
            console.log('⚡ PERFORMANCE SUMMARY');
            console.log('━'.repeat(60));
            console.log(`Average Performance Score: ${avgPerfScore}/100`);
            console.log(`Average LCP: ${avgLCP}ms`);
            results.performance.forEach((r, i) => {
                console.log(`\n${i + 1}. ${r.url}`);
                console.log(`   Performance: ${r.score}/100`);
                console.log(`   LCP: ${Math.round(r.metrics.largestContentfulPaint)}ms | TBT: ${Math.round(r.metrics.totalBlockingTime)}ms | CLS: ${r.metrics.cumulativeLayoutShift.toFixed(3)}`);
            });
            console.log();
        }
        // AI Critique Summary
        if (results.aiCritique.length > 0) {
            const avgAIScore = Math.round(results.aiCritique.reduce((sum, r) => sum + r.score, 0) / results.aiCritique.length);
            console.log('🤖 AI DESIGN CRITIQUE SUMMARY');
            console.log('━'.repeat(60));
            console.log(`Average Design Score: ${avgAIScore}/100`);
            results.aiCritique.forEach((r, i) => {
                console.log(`\n${i + 1}. ${r.url}`);
                console.log(`   Score: ${r.score}/100`);
                console.log(`   ${r.summary}`);
                console.log(`   Insights: ${r.insights.length} | Strengths: ${r.strengths.length} | Improvements: ${r.improvements.length}`);
            });
            console.log();
        }
        // Errors
        if (results.errors.length > 0) {
            console.log('❌ ERRORS ENCOUNTERED');
            console.log('━'.repeat(60));
            results.errors.forEach((err, i) => {
                console.log(`${i + 1}. ${err}`);
            });
            console.log();
        }
        // Save detailed report
        const reportPath = join(process.cwd(), 'test-report.json');
        await writeFile(reportPath, JSON.stringify(results, null, 2));
        console.log(`📄 Detailed report saved: ${reportPath}\n`);
        console.log('╔════════════════════════════════════════════════════════════╗');
        console.log('║              ✅ COMPLETE TEST FINISHED                     ║');
        console.log('╚════════════════════════════════════════════════════════════╝\n');
        // Cleanup
        await crawler.close();
        await screenshotService.close();
        await accessibilityScanner.close();
        await performanceAnalyzer.close();
    }
    catch (error) {
        console.error('\n❌ CRITICAL ERROR:', error);
        process.exit(1);
    }
}
// Run the comprehensive test
comprehensiveTest().then(() => process.exit(0));
