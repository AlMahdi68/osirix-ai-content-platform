import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { db } from '@/db';
import { aiAgentActivities } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);

    // Pagination parameters
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    // Filter parameters
    const resultFilter = searchParams.get('result');
    const activityTypeFilter = searchParams.get('activityType');

    // Build query with user filter
    let query = db.select()
      .from(aiAgentActivities)
      .where(eq(aiAgentActivities.userId, session.user.id));

    // Apply additional filters
    const conditions = [eq(aiAgentActivities.userId, session.user.id)];

    if (resultFilter) {
      conditions.push(eq(aiAgentActivities.result, resultFilter));
    }

    if (activityTypeFilter) {
      conditions.push(eq(aiAgentActivities.activityType, activityTypeFilter));
    }

    // Combine all conditions
    const whereCondition = conditions.length > 1 ? and(...conditions) : conditions[0];

    // Execute query with filters, ordering, and pagination
    const activities = await db.select()
      .from(aiAgentActivities)
      .where(whereCondition)
      .orderBy(desc(aiAgentActivities.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({ activities }, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}