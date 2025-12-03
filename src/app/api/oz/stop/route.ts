import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { db } from '@/db';
import { aiAgentActivities } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Find running OZ agent
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

    if (runningAgent.length === 0) {
      return NextResponse.json(
        {
          error: 'No running OZ agent found',
          code: 'OZ_NOT_RUNNING'
        },
        { status: 400 }
      );
    }

    const agent = runningAgent[0];
    const stoppedAt = new Date().toISOString();

    // Update agent status to stopped
    await db.update(aiAgentActivities)
      .set({
        result: 'success',
        updatedAt: stoppedAt,
        metadata: JSON.stringify({
          ...JSON.parse(agent.metadata as string || '{}'),
          stoppedAt
        })
      })
      .where(eq(aiAgentActivities.id, agent.id));

    // Create stop activity
    await db.insert(aiAgentActivities)
      .values({
        userId,
        type: 'oz_stopped',
        description: 'OZ Agent stopped by user',
        result: 'success',
        metadata: JSON.stringify({ stoppedAt }),
        createdAt: stoppedAt,
        updatedAt: stoppedAt
      });

    return NextResponse.json(
      {
        message: 'OZ Agent stopped successfully',
        stoppedAt
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('OZ Stop error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}
