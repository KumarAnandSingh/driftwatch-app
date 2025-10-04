import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import Anthropic from '@anthropic-ai/sdk';
import { getUserAnthropicKey } from '../../settings/api-keys/route';

interface Issue {
  id: string;
  title: string;
  category: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
  html?: string;
  helpUrl?: string;
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { issues, url } = await request.json();

    if (!issues || !Array.isArray(issues) || issues.length === 0) {
      return NextResponse.json(
        { error: 'Issues array is required' },
        { status: 400 }
      );
    }

    // Get user's Anthropic API key
    const userApiKey = await getUserAnthropicKey(session.user.email);

    // Fall back to system API key if user hasn't set one
    const apiKey = userApiKey || process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Anthropic API key not configured. Please add your API key in Settings.' },
        { status: 500 }
      );
    }

    const anthropic = new Anthropic({ apiKey });

    // Generate fixes for each issue
    const fixes = await Promise.all(
      issues.slice(0, 10).map(async (issue: Issue) => {
        try {
          const prompt = `You are an expert web developer and accessibility specialist. Analyze this issue and generate a code fix.

Issue Details:
- Title: ${issue.title}
- Category: ${issue.category}
- Severity: ${issue.severity}
- Description: ${issue.description}
${issue.html ? `- Current HTML: ${issue.html}` : ''}
${issue.helpUrl ? `- Reference: ${issue.helpUrl}` : ''}
- Page URL: ${url || 'N/A'}

Provide a JSON response with the following structure:
{
  "originalCode": "the problematic code snippet",
  "fixedCode": "the corrected code with proper fixes",
  "explanation": "brief explanation of what was changed and why (2-3 sentences)",
  "impact": "the impact this fix will have (1 sentence)"
}

Important:
- Provide actual, working code snippets
- Include proper ARIA labels, semantic HTML, and accessibility fixes
- Keep code examples concise but complete
- Follow WCAG 2.1 AA guidelines
- Use modern HTML5 and best practices`;

          const message = await anthropic.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 2000,
            messages: [
              {
                role: 'user',
                content: prompt,
              },
            ],
          });

          const content = message.content[0];
          if (content.type !== 'text') {
            throw new Error('Unexpected response type');
          }

          // Extract JSON from the response
          const jsonMatch = content.text.match(/\{[\s\S]*\}/);
          if (!jsonMatch) {
            throw new Error('No JSON found in response');
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
        } catch (error) {
          console.error(`Error generating fix for issue ${issue.id}:`, error);
          // Return a fallback fix if AI generation fails
          return {
            id: issue.id,
            title: issue.title,
            category: issue.category,
            severity: issue.severity,
            description: issue.description,
            originalCode: issue.html || '<!-- No code snippet available -->',
            fixedCode: '<!-- Fix generation failed. Please try again. -->',
            explanation: 'Unable to generate fix at this time. Please try again or consult the documentation.',
            impact: 'N/A',
          };
        }
      })
    );

    return NextResponse.json({ fixes });
  } catch (error) {
    console.error('Error in /api/fixes/generate:', error);
    return NextResponse.json(
      { error: 'Failed to generate fixes' },
      { status: 500 }
    );
  }
}
