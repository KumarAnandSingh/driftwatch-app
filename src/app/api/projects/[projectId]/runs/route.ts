import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { Queue } from 'bullmq';
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  maxRetriesPerRequest: null,
});

const scanQueue = new Queue('scans', { connection: redis });

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const runs = await prisma.run.findMany({
      where: { projectId: params.projectId },
      orderBy: { startedAt: 'desc' },
      take: 20,
    });

    return NextResponse.json({ runs });
  } catch (error) {
    console.error('Error fetching runs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch runs' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get project details
    const project = await prisma.project.findUnique({
      where: { id: params.projectId },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Create a new run
    const run = await prisma.run.create({
      data: {
        projectId: params.projectId,
        status: 'QUEUED',
        progress: 0,
        currentPhase: 'queued',
        configJson: {
          url: project.url,
          maxPages: project.maxPages,
          maxDepth: project.maxDepth,
          scanAccessibility: project.scanAccessibility,
          scanPerformance: project.scanPerformance,
          scanSeo: project.scanSeo,
          scanAiCritique: project.scanAiCritique,
          scanVisualRegression: project.scanVisualRegression,
          requiresAuth: project.requiresAuth,
          authUsername: project.authUsername,
          authPassword: project.authPassword,
        },
      },
    });

    // Queue the scan job
    await scanQueue.add(
      'scan',
      {
        runId: run.id,
        projectId: project.id,
        url: project.url,
        config: run.configJson,
      },
      {
        jobId: run.id,
        removeOnComplete: false,
        removeOnFail: false,
      }
    );

    return NextResponse.json(run, { status: 201 });
  } catch (error) {
    console.error('Error creating run:', error);
    return NextResponse.json(
      { error: 'Failed to create run' },
      { status: 500 }
    );
  }
}
