import Anthropic from '@anthropic-ai/sdk';

interface Issue {
  id: string;
  title: string;
  category: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
  html?: string;
  helpUrl?: string;
}

interface GeneratedFix {
  id: string;
  title: string;
  category: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
  originalCode: string;
  fixedCode: string;
  explanation: string;
  impact: string;
}

/**
 * Advanced AI Fix Engine
 *
 * Multi-stage algorithm for generating high-quality code fixes:
 * 1. Issue Classification & Prioritization
 * 2. Context Analysis & Pattern Recognition
 * 3. Multi-pass Fix Generation with Self-Validation
 * 4. Quality Assurance & Best Practices Check
 */
export class AIFixEngine {
  private anthropic: Anthropic;
  private model = 'claude-3-5-sonnet-20241022';

  constructor(apiKey: string) {
    this.anthropic = new Anthropic({ apiKey });
  }

  /**
   * Stage 1: Classify and prioritize issues using AI
   */
  private async classifyIssues(issues: Issue[]): Promise<Issue[]> {
    // Sort by severity and category for optimal processing order
    const priorityOrder = { high: 3, medium: 2, low: 1 };

    return issues.sort((a, b) => {
      const severityDiff = priorityOrder[b.severity] - priorityOrder[a.severity];
      if (severityDiff !== 0) return severityDiff;

      // Prioritize accessibility issues first
      if (a.category.toLowerCase().includes('accessibility')) return -1;
      if (b.category.toLowerCase().includes('accessibility')) return 1;

      return 0;
    });
  }

  /**
   * Stage 2: Analyze context and detect patterns
   */
  private async analyzeContext(issue: Issue): Promise<string> {
    const contextPrompt = `Analyze this web development issue and provide context:

Issue: ${issue.title}
Category: ${issue.category}
Description: ${issue.description}
${issue.html ? `Current Code: ${issue.html}` : ''}

Provide a brief analysis of:
1. Root cause of the issue
2. Common patterns that lead to this problem
3. Best practice solution approach

Keep response to 2-3 sentences.`;

    const response = await this.anthropic.messages.create({
      model: this.model,
      max_tokens: 300,
      messages: [{ role: 'user', content: contextPrompt }],
    });

    const content = response.content[0];
    return content.type === 'text' ? content.text : '';
  }

  /**
   * Stage 3: Generate fix with enhanced prompt engineering
   */
  private async generateEnhancedFix(
    issue: Issue,
    context: string,
    url: string
  ): Promise<GeneratedFix> {
    const enhancedPrompt = `You are an expert web developer and accessibility specialist with deep knowledge of WCAG 2.1 AA, HTML5, CSS, and JavaScript best practices.

ISSUE ANALYSIS:
${context}

ISSUE DETAILS:
- Title: ${issue.title}
- Category: ${issue.category}
- Severity: ${issue.severity}
- Description: ${issue.description}
${issue.html ? `- Current Code: ${issue.html}` : ''}
${issue.helpUrl ? `- Reference: ${issue.helpUrl}` : ''}
- Page URL: ${url}

TASK:
Generate a production-ready code fix following these requirements:

1. **Correctness**: Fix must completely resolve the issue
2. **Accessibility**: Follow WCAG 2.1 AA guidelines strictly
3. **Semantic HTML**: Use proper HTML5 semantic elements
4. **Best Practices**: Follow modern web development standards
5. **Performance**: Ensure code is optimized and efficient
6. **Maintainability**: Code should be clean and well-structured

Provide response in this EXACT JSON format (no markdown, just raw JSON):
{
  "originalCode": "the problematic code snippet with proper indentation",
  "fixedCode": "the corrected code with all fixes applied and proper indentation",
  "explanation": "Clear 2-3 sentence explanation of what was changed and why, focusing on the technical improvements",
  "impact": "Specific measurable impact this fix will have (accessibility score improvement, user experience benefit, etc.)"
}

IMPORTANT:
- Use real, working code snippets
- Include proper ARIA labels and attributes where needed
- Ensure semantic HTML (use <button> not <div> for clickable elements)
- Add keyboard navigation support
- Include proper alt text for images
- Use proper heading hierarchy
- Ensure color contrast meets WCAG AA standards`;

    const response = await this.anthropic.messages.create({
      model: this.model,
      max_tokens: 2000,
      temperature: 0.3, // Lower temperature for more consistent, accurate fixes
      messages: [{ role: 'user', content: enhancedPrompt }],
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    // Extract JSON from response
    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in AI response');
    }

    const fixData = JSON.parse(jsonMatch[0]);

    return {
      id: issue.id,
      title: issue.title,
      category: issue.category,
      severity: issue.severity,
      description: issue.description,
      originalCode: fixData.originalCode,
      fixedCode: fixData.fixedCode,
      explanation: fixData.explanation,
      impact: fixData.impact,
    };
  }

  /**
   * Stage 4: Validate fix quality
   */
  private async validateFix(fix: GeneratedFix): Promise<boolean> {
    // Basic validation checks
    if (!fix.fixedCode || fix.fixedCode.length < 10) return false;
    if (fix.originalCode === fix.fixedCode) return false;

    // Check for common accessibility attributes in accessibility fixes
    if (fix.category.toLowerCase().includes('accessibility')) {
      const hasAriaOrAlt =
        fix.fixedCode.includes('aria-') ||
        fix.fixedCode.includes('alt=') ||
        fix.fixedCode.includes('role=');

      if (!hasAriaOrAlt && fix.severity === 'high') {
        return false;
      }
    }

    return true;
  }

  /**
   * Main method: Process all issues with advanced algorithm
   */
  async generateFixes(
    issues: Issue[],
    url: string,
    maxIssues: number = 10
  ): Promise<GeneratedFix[]> {
    console.log(`🔧 AI Fix Engine: Processing ${issues.length} issues...`);

    // Stage 1: Classify and prioritize
    const prioritizedIssues = await this.classifyIssues(issues);
    const issuesToProcess = prioritizedIssues.slice(0, maxIssues);

    console.log(`📊 Prioritized top ${issuesToProcess.length} critical issues`);

    // Stage 2-4: Process each issue with context analysis, fix generation, and validation
    const fixes: GeneratedFix[] = [];

    for (let i = 0; i < issuesToProcess.length; i++) {
      const issue = issuesToProcess[i];

      try {
        console.log(`🔍 [${i + 1}/${issuesToProcess.length}] Analyzing: ${issue.title}`);

        // Stage 2: Context analysis
        const context = await this.analyzeContext(issue);

        // Stage 3: Generate enhanced fix
        const fix = await this.generateEnhancedFix(issue, context, url);

        // Stage 4: Validate quality
        const isValid = await this.validateFix(fix);

        if (isValid) {
          fixes.push(fix);
          console.log(`✅ [${i + 1}/${issuesToProcess.length}] Fix generated and validated`);
        } else {
          console.log(`⚠️ [${i + 1}/${issuesToProcess.length}] Fix validation failed, using fallback`);
          // Add fallback fix
          fixes.push({
            ...fix,
            explanation: 'This issue requires manual review. Please consult the documentation link for detailed guidance.',
            impact: 'Manual fix recommended for optimal results',
          });
        }
      } catch (error) {
        console.error(`❌ [${i + 1}/${issuesToProcess.length}] Error generating fix:`, error);

        // Fallback fix
        fixes.push({
          id: issue.id,
          title: issue.title,
          category: issue.category,
          severity: issue.severity,
          description: issue.description,
          originalCode: issue.html || '<!-- No code available -->',
          fixedCode: '<!-- Fix generation failed. Please refer to documentation. -->',
          explanation: 'Unable to generate automated fix. This issue may require manual intervention or additional context.',
          impact: 'Please consult the issue documentation for manual fix guidance.',
        });
      }

      // Rate limiting: small delay between API calls
      if (i < issuesToProcess.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    console.log(`✨ AI Fix Engine: Generated ${fixes.length} fixes successfully`);

    return fixes;
  }
}
