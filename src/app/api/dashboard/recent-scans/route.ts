import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user's organizations
    const orgMembers = await prisma.orgMember.findMany({
      where: { userId: user.id },
      select: { orgId: true },
    });
    const orgIds = orgMembers.map((om) => om.orgId);

    // Get recent scans (last 10) with project info
    const recentScans = await prisma.run.findMany({
      where: {
        project: { orgId: { in: orgIds } },
      },
      orderBy: { startedAt: 'desc' },
      take: 10,
      include: {
        project: {
          select: {
            id: true,
            name: true,
            url: true,
          },
        },
      },
    });

    // Transform to match frontend interface
    const scansData = recentScans.map((scan) => ({
      id: scan.id,
      projectId: scan.project.id,
      projectName: scan.project.name,
      url: scan.project.url,
      status: scan.status,
      score: scan.score,
      startedAt: scan.startedAt.toISOString(),
      finishedAt: scan.finishedAt?.toISOString() || null,
    }));

    return NextResponse.json(scansData);
  } catch (error) {
    console.error('Error fetching recent scans:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent scans' },
      { status: 500 }
    );
  }
}
