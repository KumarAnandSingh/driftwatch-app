import { chromium } from 'playwright';
import lighthouse from 'lighthouse';
export class PerformanceAnalyzer {
    browser = null;
    async initialize() {
        this.browser = await chromium.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--remote-debugging-port=9222']
        });
    }
    async analyze(options) {
        const { url, timeout = 60000, formFactor = 'desktop' } = options;
        if (!this.browser) {
            await this.initialize();
        }
        const config = {
            extends: 'lighthouse:default',
            settings: {
                formFactor,
                screenEmulation: formFactor === 'mobile'
                    ? { mobile: true, width: 375, height: 667, deviceScaleFactor: 2 }
                    : { mobile: false, width: 1920, height: 1080, deviceScaleFactor: 1 },
                throttling: formFactor === 'mobile'
                    ? { rttMs: 150, throughputKbps: 1638.4, cpuSlowdownMultiplier: 4 }
                    : { rttMs: 40, throughputKbps: 10240, cpuSlowdownMultiplier: 1 },
                onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
            },
        };
        try {
            // Run Lighthouse
            const runnerResult = await lighthouse(url, {
                port: 9222,
                output: 'json',
                logLevel: 'error',
            }, config);
            if (!runnerResult || !runnerResult.lhr) {
                throw new Error('Lighthouse analysis failed');
            }
            const lhr = runnerResult.lhr;
            // Extract Core Web Vitals
            const metrics = {
                firstContentfulPaint: lhr.audits['first-contentful-paint']?.numericValue || 0,
                largestContentfulPaint: lhr.audits['largest-contentful-paint']?.numericValue || 0,
                totalBlockingTime: lhr.audits['total-blocking-time']?.numericValue || 0,
                cumulativeLayoutShift: lhr.audits['cumulative-layout-shift']?.numericValue || 0,
                speedIndex: lhr.audits['speed-index']?.numericValue || 0,
                timeToInteractive: lhr.audits['interactive']?.numericValue || 0,
            };
            // Extract category scores
            const categories = {
                performance: Math.round((lhr.categories.performance?.score || 0) * 100),
                accessibility: Math.round((lhr.categories.accessibility?.score || 0) * 100),
                bestPractices: Math.round((lhr.categories['best-practices']?.score || 0) * 100),
                seo: Math.round((lhr.categories.seo?.score || 0) * 100),
            };
            // Extract opportunities
            const opportunities = Object.values(lhr.audits)
                .filter((audit) => audit.details?.type === 'opportunity' && audit.score !== null && audit.score < 1)
                .map((audit) => ({
                title: audit.title,
                description: audit.description,
                score: Math.round(audit.score * 100),
                savings: audit.numericValue || 0,
            }))
                .slice(0, 10); // Top 10 opportunities
            return {
                url,
                score: categories.performance,
                metrics,
                categories,
                opportunities,
                timestamp: new Date(),
            };
        }
        catch (error) {
            console.error('Performance analysis error:', error);
            throw error;
        }
    }
    async close() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }
}
// Utility function for one-off analysis
export async function analyzePerformance(options) {
    const analyzer = new PerformanceAnalyzer();
    try {
        await analyzer.initialize();
        return await analyzer.analyze(options);
    }
    finally {
        await analyzer.close();
    }
}
