import { chromium, Browser } from 'playwright';
import { injectAxe, checkA11y, getViolations } from '@axe-core/playwright';

export interface AccessibilityOptions {
  url: string;
  standard?: 'wcag2a' | 'wcag2aa' | 'wcag2aaa' | 'wcag21a' | 'wcag21aa' | 'wcag22aa';
  timeout?: number;
}

export interface AccessibilityViolation {
  id: string;
  impact: 'minor' | 'moderate' | 'serious' | 'critical';
  description: string;
  help: string;
  helpUrl: string;
  tags: string[];
  nodes: {
    html: string;
    target: string[];
    failureSummary: string;
  }[];
}

export interface AccessibilityResult {
  url: string;
  violations: AccessibilityViolation[];
  passes: number;
  incomplete: number;
  inapplicable: number;
  timestamp: Date;
  score: number; // 0-100, based on violations weighted by impact
}

export class AccessibilityScanner {
  private browser: Browser | null = null;

  async initialize() {
    this.browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }

  async scan(options: AccessibilityOptions): Promise<AccessibilityResult> {
    const {
      url,
      standard = 'wcag21aa',
      timeout = 30000
    } = options;

    if (!this.browser) {
      await this.initialize();
    }

    const page = await this.browser!.newPage();

    try {
      // Navigate to page
      await page.goto(url, {
        waitUntil: 'networkidle',
        timeout
      });

      // Inject axe-core
      await injectAxe(page);

      // Run accessibility scan
      const results = await page.evaluate(async (ruleTags) => {
        // @ts-ignore - axe is injected globally
        const axeResults = await axe.run({
          runOnly: {
            type: 'tag',
            values: [ruleTags]
          }
        });

        return {
          violations: axeResults.violations.map((v: any) => ({
            id: v.id,
            impact: v.impact,
            description: v.description,
            help: v.help,
            helpUrl: v.helpUrl,
            tags: v.tags,
            nodes: v.nodes.map((n: any) => ({
              html: n.html,
              target: n.target,
              failureSummary: n.failureSummary || ''
            }))
          })),
          passes: axeResults.passes.length,
          incomplete: axeResults.incomplete.length,
          inapplicable: axeResults.inapplicable.length
        };
      }, standard);

      // Calculate accessibility score
      const score = this.calculateScore(results.violations);

      return {
        url,
        violations: results.violations,
        passes: results.passes,
        incomplete: results.incomplete,
        inapplicable: results.inapplicable,
        timestamp: new Date(),
        score
      };
    } finally {
      await page.close();
    }
  }

  private calculateScore(violations: AccessibilityViolation[]): number {
    if (violations.length === 0) return 100;

    // Weight violations by impact
    const impactWeights = {
      critical: 10,
      serious: 7,
      moderate: 4,
      minor: 1
    };

    const totalWeight = violations.reduce((sum, v) => {
      const weight = impactWeights[v.impact] || 1;
      const nodeCount = v.nodes.length;
      return sum + (weight * nodeCount);
    }, 0);

    // Convert to 0-100 score (logarithmic scale)
    const rawScore = Math.max(0, 100 - (Math.log(totalWeight + 1) * 15));
    return Math.round(rawScore);
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

// Utility function for one-off scans
export async function scanAccessibility(options: AccessibilityOptions): Promise<AccessibilityResult> {
  const scanner = new AccessibilityScanner();
  try {
    await scanner.initialize();
    return await scanner.scan(options);
  } finally {
    await scanner.close();
  }
}
