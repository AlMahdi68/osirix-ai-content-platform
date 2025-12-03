import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { db } from '@/db';
import { aiAgentActivities } from '@/db/schema';
import { eq, desc, and, gte, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Check if OZ is running
    const runningAgent = await db.select()
      .from(aiAgentActivities)
      .where(
        and(
          eq(aiAgentActivities.userId, userId),
          eq(aiAgentActivities.type, 'oz_started'),
          eq(aiAgentActivities.result, 'pending')
        )
      )
      .orderBy(desc(aiAgentActivities.createdAt))
      .limit(1);

    const isRunning = runningAgent.length > 0;

    // Get last activity
    const lastActivity = await db.select()
      .from(aiAgentActivities)
      .where(eq(aiAgentActivities.userId, userId))
      .orderBy(desc(aiAgentActivities.createdAt))
      .limit(1);

    // Get activities in last 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const recentActivities = await db.select()
      .from(aiAgentActivities)
      .where(
        and(
          eq(aiAgentActivities.userId, userId),
          gte(aiAgentActivities.createdAt, twentyFourHoursAgo)
        )
      );

    // Calculate success rate
    const successfulActivities = recentActivities.filter(a => a.result === 'success').length;
    const totalActivities = recentActivities.length;
    const successRate = totalActivities > 0 
      ? Math.round((successfulActivities / totalActivities) * 100)
      : 0;

    // Get revenue generated (from metadata)
    let revenueGenerated = 0;
    let tasksCompleted = 0;
    
    recentActivities.forEach(activity => {
      if (activity.metadata) {
        try {
          const metadata = JSON.parse(activity.metadata as string);
          if (metadata.revenue) {
            revenueGenerated += metadata.revenue;
          }
          if (activity.result === 'success' && activity.type === 'oz_workflow') {
            tasksCompleted++;
          }
        } catch (e) {
          // Skip invalid JSON
        }
      }
    });

    const status = {
      isRunning,
      lastActivity: lastActivity.length > 0 ? lastActivity[0].createdAt : null,
      activitiesLast24h: recentActivities.length,
      successRate,
      revenueGenerated,
      tasksCompleted,
      strategy: isRunning && runningAgent[0].metadata 
        ? JSON.parse(runningAgent[0].metadata as string).strategy 
        : null,
      startedAt: isRunning ? runningAgent[0].createdAt : null
    };

    return NextResponse.json(status, { status: 200 });

  } catch (error) {
    console.error('OZ Status error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}
