import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { db } from '@/db';
import { aiAgentActivities } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';

export async function POST(request: NextRequest) {
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

    // Find the most recent active agent session (agent_started with result='pending')
    const activeAgent = await db
      .select()
      .from(aiAgentActivities)
      .where(
        and(
          eq(aiAgentActivities.userId, userId),
          eq(aiAgentActivities.type, 'agent_started'),
          eq(aiAgentActivities.result, 'pending')
        )
      )
      .orderBy(desc(aiAgentActivities.createdAt))
      .limit(1);

    if (activeAgent.length === 0) {
      return NextResponse.json(
        { 
          error: 'No active agent found',
          code: 'NO_ACTIVE_AGENT' 
        },
        { status: 400 }
      );
    }

    const agentActivity = activeAgent[0];
    const stoppedAt = new Date().toISOString();

    // Update the agent_started activity to mark as completed successfully
    await db
      .update(aiAgentActivities)
      .set({
        result: 'success',
        updatedAt: stoppedAt
      })
      .where(eq(aiAgentActivities.id, agentActivity.id));

    // Create new agent_stopped activity record
    const stoppedActivity = await db
      .insert(aiAgentActivities)
      .values({
        userId: userId,
        type: 'agent_stopped',
        description: 'AI agent stopped by user',
        result: 'success',
        metadata: JSON.stringify({
          stoppedAgentId: agentActivity.id,
          originalStartedAt: agentActivity.createdAt
        }),
        createdAt: stoppedAt,
        updatedAt: stoppedAt
      })
      .returning();

    return NextResponse.json(
      {
        message: 'Agent stopped successfully',
        stoppedAt: stoppedAt,
        activity: stoppedActivity[0]
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}