import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

// Encryption configuration
const ENCRYPTION_KEY = process.env.NEXTAUTH_SECRET || 'dev-secret-change-in-production-12345678';
const ALGORITHM = 'aes-256-cbc';

function encrypt(text: string): string {
  const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

function decrypt(encryptedText: string): string {
  const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32);
  const parts = encryptedText.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const encrypted = parts[1];
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { anthropicApiKey: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      hasAnthropicKey: !!user.anthropicApiKey,
    });
  } catch (error) {
    console.error('Error fetching API keys:', error);
    return NextResponse.json(
      { error: 'Failed to fetch API keys' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { anthropicApiKey } = body;

    if (!anthropicApiKey || typeof anthropicApiKey !== 'string') {
      return NextResponse.json(
        { error: 'Invalid API key provided' },
        { status: 400 }
      );
    }

    // Validate API key format
    if (!anthropicApiKey.startsWith('sk-ant-')) {
      return NextResponse.json(
        { error: 'Invalid Anthropic API key format. Must start with sk-ant-' },
        { status: 400 }
      );
    }

    // Encrypt the API key before storing
    const encryptedKey = encrypt(anthropicApiKey);

    await prisma.user.update({
      where: { email: session.user.email },
      data: { anthropicApiKey: encryptedKey },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving API key:', error);
    return NextResponse.json(
      { error: 'Failed to save API key' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.user.update({
      where: { email: session.user.email },
      data: { anthropicApiKey: null },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting API key:', error);
    return NextResponse.json(
      { error: 'Failed to delete API key' },
      { status: 500 }
    );
  }
}

// Helper function to get decrypted API key for use in scanners
export async function getUserAnthropicKey(userEmail: string): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    select: { anthropicApiKey: true },
  });

  if (!user?.anthropicApiKey) {
    return null;
  }

  try {
    return decrypt(user.anthropicApiKey);
  } catch (error) {
    console.error('Error decrypting API key:', error);
    return null;
  }
}
