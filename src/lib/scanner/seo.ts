import { chromium, Browser, Page } from 'playwright';

export interface SEOOptions {
  url: string;
  timeout?: number;
}

export interface SEOIssue {
  type: 'error' | 'warning' | 'info';
  category: string;
  message: string;
  element?: string;
}

export interface SEOResult {
  url: string;
  score: number; // 0-100
  title?: string;
  description?: string;
  canonical?: string;
  robots?: string;
  h1Tags: string[];
  images: {
    total: number;
    missingAlt: number;
  };
  links: {
    total: number;
    internal: number;
    external: number;
    broken?: number;
  };
  openGraph: {
    title?: string;
    description?: string;
    image?: string;
    type?: string;
  };
  twitter: {
    card?: string;
    title?: string;
    description?: string;
    image?: string;
  };
  issues: SEOIssue[];
  passed: number;
  timestamp: Date;
}

export class SEOScanner {
  private browser: Browser | null = null;

  async initialize() {
    this.browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }

  async scan(options: SEOOptions): Promise<SEOResult> {
    const { url, timeout = 30000 } = options;

    if (!this.browser) {
      await this.initialize();
    }

    const page = await this.browser!.newPage();
    const issues: SEOIssue[] = [];
    let passed = 0;

    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout });

      // Extract meta tags
      const title = await page.title();
      const description = await page.$eval('meta[name="description"]', el => el.getAttribute('content')).catch(() => undefined);
      const canonical = await page.$eval('link[rel="canonical"]', el => el.getAttribute('href')).catch(() => undefined);
      const robots = await page.$eval('meta[name="robots"]', el => el.getAttribute('content')).catch(() => undefined);

      // Check title
      if (!title || title.length === 0) {
        issues.push({
          type: 'error',
          category: 'Meta Tags',
          message: 'Missing page title',
        });
      } else if (title.length < 30 || title.length > 60) {
        issues.push({
          type: 'warning',
          category: 'Meta Tags',
          message: `Title length (${title.length}) should be between 30-60 characters`,
        });
      } else {
        passed++;
      }

      // Check description
      if (!description) {
        issues.push({
          type: 'error',
          category: 'Meta Tags',
          message: 'Missing meta description',
        });
      } else if (description.length < 120 || description.length > 160) {
        issues.push({
          type: 'warning',
          category: 'Meta Tags',
          message: `Meta description length (${description.length}) should be between 120-160 characters`,
        });
      } else {
        passed++;
      }

      // Check H1 tags
      const h1Tags = await page.$$eval('h1', elements => elements.map(el => el.textContent?.trim() || ''));
      if (h1Tags.length === 0) {
        issues.push({
          type: 'error',
          category: 'Content',
          message: 'Missing H1 tag',
        });
      } else if (h1Tags.length > 1) {
        issues.push({
          type: 'warning',
          category: 'Content',
          message: `Multiple H1 tags found (${h1Tags.length}). Should have only one.`,
        });
      } else {
        passed++;
      }

      // Check images
      const images = await page.$$eval('img', imgs => ({
        total: imgs.length,
        missingAlt: imgs.filter(img => !img.getAttribute('alt')).length,
      }));

      if (images.missingAlt > 0) {
        issues.push({
          type: 'warning',
          category: 'Images',
          message: `${images.missingAlt} images missing alt attributes`,
        });
      } else if (images.total > 0) {
        passed++;
      }

      // Check links
      const links = await page.$$eval('a', anchors => {
        const hostname = window.location.hostname;
        return {
          total: anchors.length,
          internal: anchors.filter(a => {
            const href = a.getAttribute('href');
            return href && (href.startsWith('/') || href.includes(hostname));
          }).length,
          external: anchors.filter(a => {
            const href = a.getAttribute('href');
            return href && !href.startsWith('/') && !href.includes(hostname) && (href.startsWith('http') || href.startsWith('https'));
          }).length,
        };
      });

      // Check canonical URL
      if (!canonical) {
        issues.push({
          type: 'info',
          category: 'Meta Tags',
          message: 'Missing canonical URL',
        });
      } else {
        passed++;
      }

      // Extract Open Graph data
      const openGraph = {
        title: await page.$eval('meta[property="og:title"]', el => el.getAttribute('content')).catch(() => undefined),
        description: await page.$eval('meta[property="og:description"]', el => el.getAttribute('content')).catch(() => undefined),
        image: await page.$eval('meta[property="og:image"]', el => el.getAttribute('content')).catch(() => undefined),
        type: await page.$eval('meta[property="og:type"]', el => el.getAttribute('content')).catch(() => undefined),
      };

      if (!openGraph.title) {
        issues.push({
          type: 'info',
          category: 'Social Media',
          message: 'Missing Open Graph title',
        });
      }

      // Extract Twitter Card data
      const twitter = {
        card: await page.$eval('meta[name="twitter:card"]', el => el.getAttribute('content')).catch(() => undefined),
        title: await page.$eval('meta[name="twitter:title"]', el => el.getAttribute('content')).catch(() => undefined),
        description: await page.$eval('meta[name="twitter:description"]', el => el.getAttribute('content')).catch(() => undefined),
        image: await page.$eval('meta[name="twitter:image"]', el => el.getAttribute('content')).catch(() => undefined),
      };

      // Check viewport meta tag
      const hasViewport = await page.$('meta[name="viewport"]');
      if (!hasViewport) {
        issues.push({
          type: 'error',
          category: 'Mobile',
          message: 'Missing viewport meta tag',
        });
      } else {
        passed++;
      }

      // Calculate score
      const totalChecks = 10; // Number of critical checks
      const score = Math.round((passed / totalChecks) * 100);

      return {
        url,
        score,
        title,
        description,
        canonical,
        robots,
        h1Tags,
        images,
        links,
        openGraph,
        twitter,
        issues,
        passed,
        timestamp: new Date(),
      };
    } finally {
      await page.close();
    }
  }

  async scanMultiple(urls: string[], options: Partial<SEOOptions> = {}): Promise<SEOResult[]> {
    const results: SEOResult[] = [];

    for (const url of urls) {
      try {
        const result = await this.scan({ ...options, url });
        results.push(result);
      } catch (error) {
        console.error(`Error scanning SEO for ${url}:`, error);
      }
    }

    return results;
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}
