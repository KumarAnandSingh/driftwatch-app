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

    // Get total projects count
    const totalProjects = await prisma.project.count({
      where: { userId: user.id },
    });

    // Get active scans count (IN_PROGRESS)
    const activeScans = await prisma.run.count({
      where: {
        project: { userId: user.id },
        status: 'IN_PROGRESS',
      },
    });

    // Get recent alerts (scans with score < 70 in last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentAlerts = await prisma.run.count({
      where: {
        project: { userId: user.id },
        status: 'COMPLETED',
        score: { lt: 70 },
        finishedAt: { gte: sevenDaysAgo },
      },
    });

    // Calculate average score from last 10 completed scans
    const recentCompletedRuns = await prisma.run.findMany({
      where: {
        project: { userId: user.id },
        status: 'COMPLETED',
        score: { not: null },
      },
      orderBy: { finishedAt: 'desc' },
      take: 10,
      select: { score: true },
    });

    const avgScore =
      recentCompletedRuns.length > 0
        ? Math.round(
            recentCompletedRuns.reduce((sum, run) => sum + (run.score || 0), 0) /
              recentCompletedRuns.length
          )
        : 0;

    // Determine score trend (compare last 5 vs previous 5)
    let scoreTrend: 'up' | 'down' | 'stable' = 'stable';
    if (recentCompletedRuns.length >= 10) {
      const last5Avg =
        recentCompletedRuns.slice(0, 5).reduce((sum, run) => sum + (run.score || 0), 0) / 5;
      const prev5Avg =
        recentCompletedRuns.slice(5, 10).reduce((sum, run) => sum + (run.score || 0), 0) / 5;

      if (last5Avg > prev5Avg + 2) scoreTrend = 'up';
      else if (last5Avg < prev5Avg - 2) scoreTrend = 'down';
    }

    return NextResponse.json({
      totalProjects,
      activeScans,
      recentAlerts,
      avgScore,
      scoreTrend,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
