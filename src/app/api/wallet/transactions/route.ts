import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { transactions } from '@/db/schema';
import { eq, desc, and, gte, lte, count } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // Authenticate user using better-auth
    const session = await auth.api.getSession({ 
      headers: await headers() 
    });

    if (!session) {
      return NextResponse.json({ 
        error: 'Authentication required',
        code: 'UNAUTHORIZED' 
      }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build filter conditions
    const conditions = [eq(transactions.userId, session.user.id)];

    // Apply optional filters
    if (type) {
      conditions.push(eq(transactions.type, type));
    }

    if (status) {
      conditions.push(eq(transactions.status, status));
    }

    if (startDate) {
      conditions.push(gte(transactions.createdAt, startDate));
    }

    if (endDate) {
      conditions.push(lte(transactions.createdAt, endDate));
    }

    // Build where clause
    const whereClause = conditions.length > 1 ? and(...conditions) : conditions[0];

    // Get total count for pagination
    const totalResult = await db
      .select({ count: count() })
      .from(transactions)
      .where(whereClause);

    const total = totalResult[0]?.count ?? 0;

    // Fetch transactions with filters, sorting, and pagination
    const results = await db
      .select()
      .from(transactions)
      .where(whereClause)
      .orderBy(desc(transactions.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      transactions: results,
      total,
      limit,
      offset
    }, { status: 200 });

  } catch (error) {
    console.error('GET transactions error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}