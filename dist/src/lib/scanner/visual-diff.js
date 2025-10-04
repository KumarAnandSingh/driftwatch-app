import { readFile, writeFile } from 'fs/promises';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import sharp from 'sharp';
import { join } from 'path';
export class VisualDiffService {
    /**
     * Compare two images and generate a diff
     */
    async compare(options) {
        const { baselineImagePath, currentImagePath, outputDiffPath, threshold = 0.1 } = options;
        // Load images
        const [baselineBuffer, currentBuffer] = await Promise.all([
            readFile(baselineImagePath),
            readFile(currentImagePath)
        ]);
        // Decode PNGs
        const baseline = PNG.sync.read(baselineBuffer);
        const current = PNG.sync.read(currentBuffer);
        // Ensure images are same size (resize if needed)
        let currentResized = current;
        if (baseline.width !== current.width || baseline.height !== current.height) {
            const resizedBuffer = await sharp(currentBuffer)
                .resize(baseline.width, baseline.height, { fit: 'fill' })
                .png()
                .toBuffer();
            currentResized = PNG.sync.read(resizedBuffer);
        }
        // Create diff image
        const diff = new PNG({ width: baseline.width, height: baseline.height });
        // Compare images
        const mismatchedPixels = pixelmatch(baseline.data, currentResized.data, diff.data, baseline.width, baseline.height, {
            threshold,
            includeAA: false, // Ignore anti-aliasing differences
            alpha: 0.1,
            diffColor: [255, 0, 0], // Red for differences
            diffColorAlt: [0, 255, 0], // Green for anti-aliasing differences
        });
        const totalPixels = baseline.width * baseline.height;
        const mismatchPercentage = (mismatchedPixels / totalPixels) * 100;
        const similarity = Math.max(0, 100 - mismatchPercentage);
        // Save diff image if path provided
        let diffImagePath;
        if (outputDiffPath || mismatchedPixels > 0) {
            const timestamp = Date.now();
            diffImagePath = outputDiffPath || join(process.cwd(), 'public', 'artifacts', `diff_${timestamp}.png`);
            const diffBuffer = PNG.sync.write(diff);
            await writeFile(diffImagePath, diffBuffer);
        }
        // Consider passed if similarity > 98% (allowing for minor rendering differences)
        const passed = similarity >= 98;
        return {
            baselineImagePath,
            currentImagePath,
            diffImagePath,
            mismatchedPixels,
            totalPixels,
            mismatchPercentage: parseFloat(mismatchPercentage.toFixed(2)),
            similarity: parseFloat(similarity.toFixed(2)),
            passed,
            timestamp: new Date()
        };
    }
    /**
     * Compare multiple image pairs
     */
    async compareMultiple(pairs) {
        const results = [];
        for (const pair of pairs) {
            try {
                const result = await this.compare({
                    baselineImagePath: pair.baseline,
                    currentImagePath: pair.current,
                    outputDiffPath: pair.output
                });
                results.push(result);
            }
            catch (error) {
                console.error(`Error comparing ${pair.baseline} and ${pair.current}:`, error);
            }
        }
        return results;
    }
    /**
     * Create a baseline image from a current screenshot
     */
    async createBaseline(sourcePath, baselinePath) {
        const buffer = await readFile(sourcePath);
        await writeFile(baselinePath, buffer);
    }
}
// Utility function for one-off comparisons
export async function compareImages(options) {
    const service = new VisualDiffService();
    return await service.compare(options);
}
