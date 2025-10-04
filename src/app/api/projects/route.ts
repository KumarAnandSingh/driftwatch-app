import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { encrypt } from '@/lib/crypto';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's organization (for now, assume first org)
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        orgMembers: {
          include: {
            org: {
              include: {
                projects: {
                  include: {
                    runs: {
                      take: 1,
                      orderBy: { startedAt: 'desc' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user || !user.orgMembers[0]) {
      return NextResponse.json({ projects: [] });
    }

    const projects = user.orgMembers[0].org.projects;

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

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

    // Encrypt password if provided
    let encryptedPassword = null;
    if (body.requiresAuth && body.authPassword) {
      encryptedPassword = encrypt(body.authPassword);
    }

    // Create project
    const project = await prisma.project.create({
      data: {
        orgId,
        name: body.name,
        description: body.description,
        url: body.url,
        domains: { domains: [new URL(body.url).hostname] },

        requiresAuth: body.requiresAuth || false,
        authUsername: body.authUsername,
        authPassword: encryptedPassword,

        maxPages: body.maxPages || 50,
        maxDepth: body.maxDepth || 2,

        scanAccessibility: body.scanAccessibility ?? true,
        scanPerformance: body.scanPerformance ?? true,
        scanSeo: body.scanSeo ?? true,
        scanAiCritique: body.scanAiCritique ?? true,
        scanVisualRegression: body.scanVisualRegression ?? true,

        verified: false, // Will be verified later
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
