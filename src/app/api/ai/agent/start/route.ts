import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { db } from '@/db';
import { aiAgentActivities } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';

const VALID_MODES = ['aggressive', 'balanced', 'conservative'] as const;
const DEFAULT_MODE = 'balanced';
const DEFAULT_TASKS = ['product_generation', 'logo_generation', 'campaign_planning'];

type AgentMode = typeof VALID_MODES[number];

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

    // Parse and validate request body
    const body = await request.json();
    const mode: AgentMode = body.mode || DEFAULT_MODE;
    const tasks: string[] = body.tasks || DEFAULT_TASKS;

    // Validate mode
    if (!VALID_MODES.includes(mode)) {
      return NextResponse.json(
        {
          error: `Invalid mode. Must be one of: ${VALID_MODES.join(', ')}`,
          code: 'INVALID_MODE'
        },
        { status: 400 }
      );
    }

    // Validate tasks
    if (!Array.isArray(tasks)) {
      return NextResponse.json(
        {
          error: 'Tasks must be an array',
          code: 'INVALID_TASKS'
        },
        { status: 400 }
      );
    }

    if (tasks.length === 0) {
      return NextResponse.json(
        {
          error: 'Tasks array cannot be empty',
          code: 'EMPTY_TASKS'
        },
        { status: 400 }
      );
    }

    // Check if agent is already running
    const recentActivities = await db.select()
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

    if (recentActivities.length > 0) {
      return NextResponse.json(
        {
          error: 'Agent is already running',
          code: 'AGENT_ALREADY_RUNNING'
        },
        { status: 400 }
      );
    }

    // Create agent activity record
    const startedAt = new Date().toISOString();
    const description = `AI agent started in ${mode} mode`;
    const metadata = {
      mode,
      tasks,
      startedAt
    };

    const newActivity = await db.insert(aiAgentActivities)
      .values({
        userId,
        type: 'agent_started',
        description,
        result: 'pending',
        metadata: JSON.stringify(metadata),
        createdAt: startedAt,
        updatedAt: startedAt
      })
      .returning();

    if (newActivity.length === 0) {
      return NextResponse.json(
        {
          error: 'Failed to create agent activity record',
          code: 'ACTIVITY_CREATION_FAILED'
        },
        { status: 500 }
      );
    }

    const activity = newActivity[0];

    return NextResponse.json(
      {
        message: 'Agent started successfully',
        agentId: activity.id,
        mode,
        tasks,
        startedAt
      },
      { status: 201 }
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