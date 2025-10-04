import { chromium, Browser, Page } from 'playwright';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import sharp from 'sharp';

export interface ScreenshotOptions {
  url: string;
  outputPath?: string;
  fullPage?: boolean;
  width?: number;
  height?: number;
  timeout?: number;
  quality?: number;
}

export interface ScreenshotResult {
  url: string;
  path: string;
  width: number;
  height: number;
  size: number;
  timestamp: Date;
}

export class ScreenshotService {
  private browser: Browser | null = null;

  async initialize() {
    this.browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }

  async capture(options: ScreenshotOptions): Promise<ScreenshotResult> {
    const {
      url,
      outputPath,
      fullPage = true,
      width = 1920,
      height = 1080,
      timeout = 30000,
      quality = 90
    } = options;

    if (!this.browser) {
      await this.initialize();
    }

    const page = await this.browser!.newPage({
      viewport: { width, height }
    });

    try {
      // Navigate to page
      await page.goto(url, {
        waitUntil: 'networkidle',
        timeout
      });

      // Wait for any animations to complete
      await page.waitForTimeout(1000);

      // Take screenshot
      const screenshotBuffer = await page.screenshot({
        fullPage,
        type: 'png'
      });

      // Generate output path if not provided
      const timestamp = Date.now();
      const sanitizedUrl = url.replace(/[^a-z0-9]/gi, '_').substring(0, 50);
      const filename = `screenshot_${sanitizedUrl}_${timestamp}.png`;
      const filepath = outputPath || join(process.cwd(), 'public', 'artifacts', filename);

      // Optimize image with sharp
      const optimizedBuffer = await sharp(screenshotBuffer)
        .png({ quality, compressionLevel: 9 })
        .toBuffer();

      // Save to disk
      await writeFile(filepath, optimizedBuffer);

      // Get image metadata
      const metadata = await sharp(optimizedBuffer).metadata();

      return {
        url,
        path: filepath,
        width: metadata.width || width,
        height: metadata.height || height,
        size: optimizedBuffer.length,
        timestamp: new Date()
      };
    } finally {
      await page.close();
    }
  }

  async captureMultiple(urls: string[], options: Partial<ScreenshotOptions> = {}): Promise<ScreenshotResult[]> {
    const results: ScreenshotResult[] = [];

    for (const url of urls) {
      try {
        const result = await this.capture({ ...options, url });
        results.push(result);
      } catch (error) {
        console.error(`Error capturing screenshot for ${url}:`, error);
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

// Utility function for one-off screenshots
export async function captureScreenshot(options: ScreenshotOptions): Promise<ScreenshotResult> {
  const service = new ScreenshotService();
  try {
    await service.initialize();
    return await service.capture(options);
  } finally {
    await service.close();
  }
}
