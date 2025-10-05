import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, url } = body;

    // Get user's organization (or create one if doesn't exist)
    let user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        orgMembers: {
          include: {
            org: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let orgId: string;

    if (user.orgMembers.length === 0) {
      // Create personal organization
      const org = await prisma.org.create({
        data: {
          name: `${user.email}'s Organization`,
          members: {
            create: {
              userId: user.id,
              role: 'owner',
            },
          },
        },
      });
      orgId = org.id;
    } else {
      orgId = user.orgMembers[0].orgId;
    }

    // Create project with default settings
    const project = await prisma.project.create({
      data: {
        orgId,
        name,
        url,
        domains: { domains: [new URL(url).hostname] },
        maxPages: 50,
        maxDepth: 2,
        scanAccessibility: true,
        scanPerformance: true,
        scanSeo: true,
        scanAiCritique: true,
        scanVisualRegression: true,
        verified: false,
      },
    });

    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error('Error creating project during onboarding:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
