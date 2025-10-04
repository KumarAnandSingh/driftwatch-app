import Anthropic from '@anthropic-ai/sdk';
import { readFile } from 'fs/promises';
import sharp from 'sharp';
export class AICritiqueService {
    client;
    constructor(apiKey) {
        this.client = new Anthropic({
            apiKey: apiKey || process.env.ANTHROPIC_API_KEY || ''
        });
    }
    async critique(options) {
        const { screenshotPath, url, pageTitle, context } = options;
        // Read and encode screenshot
        const imageBuffer = await readFile(screenshotPath);
        // Resize image if too large (max 1568px as per Anthropic limits)
        const resizedBuffer = await sharp(imageBuffer)
            .resize(1568, 1568, { fit: 'inside', withoutEnlargement: true })
            .png()
            .toBuffer();
        const base64Image = resizedBuffer.toString('base64');
        // Construct prompt
        const prompt = this.buildPrompt(url, pageTitle, context);
        try {
            const message = await this.client.messages.create({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 2048,
                messages: [
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'image',
                                source: {
                                    type: 'base64',
                                    media_type: 'image/png',
                                    data: base64Image,
                                },
                            },
                            {
                                type: 'text',
                                text: prompt,
                            },
                        ],
                    },
                ],
            });
            // Parse AI response
            const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
            const result = this.parseResponse(responseText, url);
            return result;
        }
        catch (error) {
            console.error('AI critique error:', error);
            // Return fallback result
            return this.getFallbackResult(url);
        }
    }
    buildPrompt(url, pageTitle, context) {
        return `You are an expert UX/UI designer and web accessibility consultant. Analyze this webpage screenshot and provide a comprehensive design critique.

URL: ${url}
${pageTitle ? `Page Title: ${pageTitle}` : ''}
${context ? `Context: ${context}` : ''}

Please provide your analysis in the following JSON format:

{
  "score": <number 0-100>,
  "summary": "<brief 2-3 sentence overview>",
  "insights": [
    {
      "category": "<layout|typography|color|spacing|accessibility|ux|branding>",
      "severity": "<low|medium|high>",
      "title": "<short title>",
      "description": "<detailed description>",
      "suggestion": "<actionable recommendation>"
    }
  ],
  "strengths": ["<strength 1>", "<strength 2>", ...],
  "improvements": ["<improvement 1>", "<improvement 2>", ...]
}

Focus on:
1. **Layout & Hierarchy**: Visual hierarchy, grid alignment, responsive design
2. **Typography**: Font choices, sizes, readability, line heights
3. **Color & Contrast**: Color scheme, accessibility, brand consistency
4. **Spacing**: Whitespace, padding, margins, breathing room
5. **Accessibility**: WCAG compliance, screen reader friendliness, keyboard navigation
6. **UX Patterns**: User flows, call-to-actions, navigation clarity
7. **Branding**: Consistency, professional appearance, trust signals

Be specific and actionable. Identify both strengths and areas for improvement.`;
    }
    parseResponse(responseText, url) {
        try {
            // Extract JSON from response (may be wrapped in markdown code blocks)
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                return this.getFallbackResult(url);
            }
            const parsed = JSON.parse(jsonMatch[0]);
            return {
                url,
                score: parsed.score || 75,
                summary: parsed.summary || 'AI analysis completed',
                insights: parsed.insights || [],
                strengths: parsed.strengths || [],
                improvements: parsed.improvements || [],
                timestamp: new Date()
            };
        }
        catch (error) {
            console.error('Failed to parse AI response:', error);
            return this.getFallbackResult(url);
        }
    }
    getFallbackResult(url) {
        return {
            url,
            score: 75,
            summary: 'AI critique service temporarily unavailable. Manual review recommended.',
            insights: [],
            strengths: ['Page loads successfully', 'Content is visible'],
            improvements: ['Enable AI critique service with ANTHROPIC_API_KEY'],
            timestamp: new Date()
        };
    }
}
// Utility function for one-off critiques
export async function critiqueDesign(options) {
    const service = new AICritiqueService();
    return await service.critique(options);
}
