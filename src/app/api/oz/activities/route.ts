import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { db } from '@/db';
import { aiAgentActivities } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

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
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');

    const activities = await db.select()
      .from(aiAgentActivities)
      .where(eq(aiAgentActivities.userId, userId))
      .orderBy(desc(aiAgentActivities.createdAt))
      .limit(Math.min(limit, 100));

    return NextResponse.json(
      {
        activities: activities.map(a => ({
          id: a.id,
          activityType: a.type,
          description: a.description,
          relatedResourceType: a.relatedResourceType,
          relatedResourceId: a.relatedResourceId,
          result: a.result,
          metadata: a.metadata ? JSON.parse(a.metadata as string) : null,
          createdAt: a.createdAt
        }))
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('OZ Activities error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}
