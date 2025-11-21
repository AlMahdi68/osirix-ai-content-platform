import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { db } from '@/db';
import { aiAgentActivities } from '@/db/schema';
import { eq, desc, and, gte, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Authentication check
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Calculate timestamps
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    // Check if agent is currently running (pending activity in last 5 minutes)
    const runningActivities = await db
      .select()
      .from(aiAgentActivities)
      .where(
        and(
          eq(aiAgentActivities.userId, userId),
          eq(aiAgentActivities.result, 'pending'),
          gte(aiAgentActivities.createdAt, fiveMinutesAgo)
        )
      )
      .limit(1);

    const isRunning = runningActivities.length > 0;

    // Get last activity
    const lastActivityResult = await db
      .select()
      .from(aiAgentActivities)
      .where(eq(aiAgentActivities.userId, userId))
      .orderBy(desc(aiAgentActivities.createdAt))
      .limit(1);

    const lastActivity = lastActivityResult.length > 0 ? lastActivityResult[0].createdAt : null;

    // Count total activities in last 24 hours
    const totalActivitiesResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(aiAgentActivities)
      .where(
        and(
          eq(aiAgentActivities.userId, userId),
          gte(aiAgentActivities.createdAt, twentyFourHoursAgo)
        )
      );

    const activitiesLast24h = totalActivitiesResult[0]?.count || 0;

    // Count successful activities in last 24 hours
    const successfulActivitiesResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(aiAgentActivities)
      .where(
        and(
          eq(aiAgentActivities.userId, userId),
          eq(aiAgentActivities.result, 'success'),
          gte(aiAgentActivities.createdAt, twentyFourHoursAgo)
        )
      );

    const successfulActivities = successfulActivitiesResult[0]?.count || 0;

    // Calculate success rate
    const successRate = activitiesLast24h > 0 
      ? Math.round((successfulActivities / activitiesLast24h) * 100) 
      : 0;

    return NextResponse.json({
      isRunning,
      lastActivity,
      activitiesLast24h,
      successRate
    });

  } catch (error) {
    console.error('GET agent status error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}