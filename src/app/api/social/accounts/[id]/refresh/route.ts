import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { socialAccounts } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authenticate user
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    // Parse and validate ID from params
    const { id } = await params;
    const accountId = parseInt(id);

    if (!accountId || isNaN(accountId)) {
      return NextResponse.json(
        { error: 'Valid account ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Fetch social account (user-scoped)
    const account = await db
      .select()
      .from(socialAccounts)
      .where(
        and(
          eq(socialAccounts.id, accountId),
          eq(socialAccounts.userId, session.user.id)
        )
      )
      .limit(1);

    if (account.length === 0) {
      return NextResponse.json(
        { error: 'Social account not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const socialAccount = account[0];

    // Check if refresh token exists
    if (!socialAccount.refreshToken) {
      return NextResponse.json(
        { error: 'No refresh token available', code: 'NO_REFRESH_TOKEN' },
        { status: 400 }
      );
    }

    // TODO: Replace with actual OAuth token refresh for production
    // Mock token refresh process
    const newAccessToken = `mock_access_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const newRefreshToken = `mock_refresh_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    // Calculate new expiry: 60 days from now
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 60);
    const tokenExpiresAt = expiryDate.toISOString();
    
    const lastRefreshedAt = new Date().toISOString();
    const updatedAt = new Date().toISOString();

    // Update socialAccounts record with new tokens and timestamps
    const updated = await db
      .update(socialAccounts)
      .set({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        tokenExpiresAt,
        lastRefreshedAt,
        isConnected: true,
        updatedAt,
      })
      .where(
        and(
          eq(socialAccounts.id, accountId),
          eq(socialAccounts.userId, session.user.id)
        )
      )
      .returning();

    if (updated.length === 0) {
      return NextResponse.json(
        { error: 'Failed to update social account', code: 'UPDATE_FAILED' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        expiresAt: tokenExpiresAt,
        lastRefreshedAt,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('POST /api/social/accounts/[id]/refresh error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    );
  }
}