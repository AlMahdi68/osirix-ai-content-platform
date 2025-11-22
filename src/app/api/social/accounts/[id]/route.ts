import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { socialAccounts } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authenticate user using Better Auth
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    // Parse id from params
    const { id } = await params;

    // Validate id is a valid integer
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const accountId = parseInt(id);

    // Check if social account exists and belongs to authenticated user
    const existingAccount = await db
      .select()
      .from(socialAccounts)
      .where(
        and(
          eq(socialAccounts.id, accountId),
          eq(socialAccounts.userId, session.user.id)
        )
      )
      .limit(1);

    if (existingAccount.length === 0) {
      return NextResponse.json(
        { error: 'Social account not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Delete the social account record from database
    const deleted = await db
      .delete(socialAccounts)
      .where(
        and(
          eq(socialAccounts.id, accountId),
          eq(socialAccounts.userId, session.user.id)
        )
      )
      .returning();

    // Return success response
    return NextResponse.json(
      {
        success: true,
        account: deleted[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE social account error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    );
  }
}