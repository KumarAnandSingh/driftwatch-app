import { chromium } from 'playwright';
export class WebCrawler {
    browser = null;
    visitedUrls = new Set();
    results = [];
    async initialize() {
        this.browser = await chromium.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
    }
    async crawl(options) {
        const { seedUrl, maxDepth = 2, maxPages = 50, timeout = 30000, userAgent = 'DriftWatch/1.0' } = options;
        if (!this.browser) {
            await this.initialize();
        }
        this.visitedUrls.clear();
        this.results = [];
        await this.crawlPage(seedUrl, 0, maxDepth, maxPages, timeout, userAgent);
        return this.results;
    }
    async crawlPage(url, currentDepth, maxDepth, maxPages, timeout, userAgent) {
        // Stop if max depth or max pages reached
        if (currentDepth > maxDepth || this.results.length >= maxPages) {
            return;
        }
        // Normalize URL and skip if already visited
        const normalizedUrl = this.normalizeUrl(url);
        if (this.visitedUrls.has(normalizedUrl)) {
            return;
        }
        this.visitedUrls.add(normalizedUrl);
        const page = await this.browser.newPage({
            userAgent,
            viewport: { width: 1920, height: 1080 }
        });
        try {
            // Navigate to page with timeout
            await page.goto(url, {
                waitUntil: 'networkidle',
                timeout
            });
            // Get page title
            const title = await page.title();
            // Extract all links
            const links = await page.$$eval('a[href]', (anchors) => anchors
                .map((a) => a.href)
                .filter((href) => href && !href.startsWith('javascript:') && !href.startsWith('mailto:')));
            // Filter links to same origin
            const baseUrl = new URL(url);
            const sameOriginLinks = links.filter((link) => {
                try {
                    const linkUrl = new URL(link);
                    return linkUrl.origin === baseUrl.origin;
                }
                catch {
                    return false;
                }
            });
            // Store result
            this.results.push({
                url: normalizedUrl,
                title,
                depth: currentDepth,
                links: sameOriginLinks,
                timestamp: new Date()
            });
            // Crawl child pages if depth allows
            if (currentDepth < maxDepth && this.results.length < maxPages) {
                const uniqueLinks = [...new Set(sameOriginLinks)];
                for (const link of uniqueLinks.slice(0, 10)) {
                    // Limit to 10 links per page
                    if (this.results.length >= maxPages)
                        break;
                    await this.crawlPage(link, currentDepth + 1, maxDepth, maxPages, timeout, userAgent);
                }
            }
        }
        catch (error) {
            console.error(`Error crawling ${url}:`, error);
        }
        finally {
            await page.close();
        }
    }
    normalizeUrl(url) {
        try {
            const parsed = new URL(url);
            // Remove trailing slash and hash
            parsed.hash = '';
            let normalized = parsed.toString();
            if (normalized.endsWith('/')) {
                normalized = normalized.slice(0, -1);
            }
            return normalized;
        }
        catch {
            return url;
        }
    }
    async close() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }
}
// Utility function for one-off crawls
export async function crawlWebsite(options) {
    const crawler = new WebCrawler();
    try {
        await crawler.initialize();
        return await crawler.crawl(options);
    }
    finally {
        await crawler.close();
    }
}
