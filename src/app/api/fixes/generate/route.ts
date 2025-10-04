import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getUserAnthropicKey } from '../../settings/api-keys/route';
import { AIFixEngine } from '@/lib/ai-fix-engine';

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

    // Get user's Anthropic API key - REQUIRED (no fallback)
    const userApiKey = await getUserAnthropicKey(session.user.email);

    if (!userApiKey) {
      return NextResponse.json(
        {
          error: 'API key required',
          message: 'Please add your Anthropic API key in Settings to use AI-powered fixes. Get your key at https://console.anthropic.com/settings/keys',
          requiresApiKey: true,
        },
        { status: 403 }
      );
    }

    // Initialize the intelligent AI Fix Engine
    console.log(`🚀 Initializing AI Fix Engine for ${issues.length} issues...`);
    const fixEngine = new AIFixEngine(userApiKey);

    // Use advanced multi-stage algorithm to generate fixes
    const fixes = await fixEngine.generateFixes(issues, url || 'Unknown URL', 10);

    console.log(`✅ AI Fix Engine completed: ${fixes.length} fixes generated`);

    return NextResponse.json({ fixes });
  } catch (error) {
    console.error('❌ Error in /api/fixes/generate:', error);

    // Provide helpful error messages
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          {
            error: 'Invalid API key',
            message: 'Your Anthropic API key appears to be invalid. Please check it in Settings.',
          },
          { status: 401 }
        );
      }

      if (error.message.includes('rate limit')) {
        return NextResponse.json(
          {
            error: 'Rate limit exceeded',
            message: 'Too many requests. Please wait a moment and try again.',
          },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      {
        error: 'Failed to generate fixes',
        message: 'An unexpected error occurred. Please try again.',
      },
      { status: 500 }
    );
  }
}
