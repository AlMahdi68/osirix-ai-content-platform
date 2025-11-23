import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { db } from '@/db';
import { withdrawalRequests } from '@/db/schema';
import { eq, desc, and, count } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const session = await auth.api.getSession({ 
      headers: await headers() 
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const limitParam = searchParams.get('limit');
    const offsetParam = searchParams.get('offset');
    const statusParam = searchParams.get('status');

    // Validate and set limit (default 20, max 100)
    const limit = Math.min(
      parseInt(limitParam ?? '20'),
      100
    );

    // Validate and set offset (default 0)
    const offset = parseInt(offsetParam ?? '0');

    if (isNaN(offset) || offset < 0) {
      return NextResponse.json(
        { error: 'Invalid offset parameter', code: 'INVALID_OFFSET' },
        { status: 400 }
      );
    }

    // Build base query conditions
    const conditions = [eq(withdrawalRequests.userId, session.user.id)];

    // Add status filter if provided
    if (statusParam) {
      const validStatuses = ['pending', 'processing', 'completed', 'rejected'];
      if (!validStatuses.includes(statusParam)) {
        return NextResponse.json(
          { 
            error: 'Invalid status parameter. Must be one of: pending, processing, completed, rejected',
            code: 'INVALID_STATUS' 
          },
          { status: 400 }
        );
      }
      conditions.push(eq(withdrawalRequests.status, statusParam));
    }

    const whereCondition = conditions.length > 1 
      ? and(...conditions) 
      : conditions[0];

    // Get total count for pagination
    const totalResult = await db
      .select({ count: count() })
      .from(withdrawalRequests)
      .where(whereCondition);

    const total = totalResult[0]?.count ?? 0;

    // Fetch withdrawals with filters, ordering, and pagination
    const withdrawals = await db
      .select()
      .from(withdrawalRequests)
      .where(whereCondition)
      .orderBy(desc(withdrawalRequests.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      withdrawals,
      total,
      limit,
      offset
    });

  } catch (error) {
    console.error('GET withdrawals error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}