import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string; runId: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const run = await prisma.run.findUnique({
      where: {
        id: params.runId,
        projectId: params.projectId,
      },
    });

    if (!run) {
      return NextResponse.json({ error: 'Run not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: run.id,
      status: run.status,
      progress: run.progress,
      currentPhase: run.currentPhase,
      pagesScanned: run.pagesScanned,
      issuesCritical: run.issuesCritical,
      issuesWarning: run.issuesWarning,
      issuesPassed: run.issuesPassed,
      score: run.score,
      startedAt: run.startedAt,
      finishedAt: run.finishedAt,
    });
  } catch (error) {
    console.error('Error fetching run status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch run status' },
      { status: 500 }
    );
  }
}
