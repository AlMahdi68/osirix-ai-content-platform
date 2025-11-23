import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { transactions } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user) {
      return NextResponse.json({ 
        error: 'Authentication required',
        code: 'UNAUTHORIZED' 
      }, { status: 401 });
    }

    // Query all completed earning transactions for the authenticated user
    const earningTransactions = await db.select()
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, session.user.id),
          eq(transactions.type, 'earning'),
          eq(transactions.status, 'completed')
        )
      );

    // Initialize summary structure
    const bySourceType: Record<string, { totalAmount: number; count: number; averageAmount: number }> = {};
    let totalEarnings = 0;
    let totalTransactions = 0;

    // Process transactions and group by sourceType
    for (const transaction of earningTransactions) {
      const sourceType = transaction.sourceType;
      
      if (!bySourceType[sourceType]) {
        bySourceType[sourceType] = {
          totalAmount: 0,
          count: 0,
          averageAmount: 0
        };
      }

      bySourceType[sourceType].totalAmount += transaction.amount;
      bySourceType[sourceType].count += 1;
      totalEarnings += transaction.amount;
      totalTransactions += 1;
    }

    // Calculate average amount for each source type
    for (const sourceType in bySourceType) {
      const sourceData = bySourceType[sourceType];
      sourceData.averageAmount = Math.round(sourceData.totalAmount / sourceData.count);
    }

    // Build response object
    const summary = {
      bySourceType,
      totalEarnings,
      totalTransactions
    };

    return NextResponse.json(summary, { status: 200 });

  } catch (error) {
    console.error('GET earnings-summary error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
      code: 'INTERNAL_ERROR'
    }, { status: 500 });
  }
}