import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { socialPosts, socialAccounts } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authenticate user using auth.api.getSession()
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

    const postId = parseInt(id);

    // Fetch social post WHERE id = postId AND userId = session.user.id
    const post = await db
      .select()
      .from(socialPosts)
      .where(and(eq(socialPosts.id, postId), eq(socialPosts.userId, session.user.id)))
      .limit(1);

    // If not found, return 404
    if (post.length === 0) {
      return NextResponse.json(
        { error: 'Post not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const existingPost = post[0];

    // Validate post status is "draft" or "scheduled"
    if (existingPost.status !== 'draft' && existingPost.status !== 'scheduled') {
      if (existingPost.status === 'published') {
        return NextResponse.json(
          { error: 'Post already published', code: 'ALREADY_PUBLISHED' },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: 'Post cannot be published in current status', code: 'INVALID_STATUS' },
        { status: 400 }
      );
    }

    // If platformAccountId exists, verify the account
    if (existingPost.platformAccountId) {
      const account = await db
        .select()
        .from(socialAccounts)
        .where(
          and(
            eq(socialAccounts.id, existingPost.platformAccountId),
            eq(socialAccounts.userId, session.user.id)
          )
        )
        .limit(1);

      if (account.length === 0) {
        return NextResponse.json(
          { error: 'Platform account not found', code: 'ACCOUNT_NOT_FOUND' },
          { status: 404 }
        );
      }

      const platformAccount = account[0];

      // Verify account is connected
      if (!platformAccount.isConnected) {
        return NextResponse.json(
          { error: 'Platform account is not connected', code: 'ACCOUNT_NOT_CONNECTED' },
          { status: 400 }
        );
      }

      // Verify account matches post's platform
      if (platformAccount.platform !== existingPost.platform) {
        return NextResponse.json(
          { error: 'Platform account does not match post platform', code: 'PLATFORM_MISMATCH' },
          { status: 400 }
        );
      }
    }

    // TODO: Replace with actual platform publishing API calls for production
    // Mock publishing process
    const platformPostId = `${existingPost.platform}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const publishedAt = new Date().toISOString();
    const impressions = Math.floor(Math.random() * 100);
    const engagements = Math.floor(Math.random() * 20);
    const clicks = Math.floor(Math.random() * 10);

    // Update socialPosts record with new data
    const updatedPost = await db
      .update(socialPosts)
      .set({
        status: 'published',
        publishedAt,
        platformPostId,
        impressions,
        engagements,
        clicks,
        errorMessage: null,
        updatedAt: new Date().toISOString(),
      })
      .where(and(eq(socialPosts.id, postId), eq(socialPosts.userId, session.user.id)))
      .returning();

    if (updatedPost.length === 0) {
      return NextResponse.json(
        { error: 'Failed to update post', code: 'UPDATE_FAILED' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        post: updatedPost[0],
        platformPostId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('POST /api/social/posts/[id]/publish error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    );
  }
}