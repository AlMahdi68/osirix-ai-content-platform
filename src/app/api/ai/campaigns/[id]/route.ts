import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { db } from '@/db';
import { aiCampaigns } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authentication check
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    // Get and validate ID
    const { id } = await params;
    const campaignId = parseInt(id);

    if (!id || isNaN(campaignId)) {
      return NextResponse.json(
        { error: 'Valid campaign ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Fetch campaign with user ownership verification
    const campaign = await db
      .select()
      .from(aiCampaigns)
      .where(
        and(
          eq(aiCampaigns.id, campaignId),
          eq(aiCampaigns.userId, session.user.id)
        )
      )
      .limit(1);

    if (campaign.length === 0) {
      return NextResponse.json(
        { error: 'Campaign not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json({ campaign: campaign[0] }, { status: 200 });
  } catch (error) {
    console.error('GET campaign error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authentication check
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    // Get and validate ID
    const { id } = await params;
    const campaignId = parseInt(id);

    if (!id || isNaN(campaignId)) {
      return NextResponse.json(
        { error: 'Valid campaign ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Security check: reject if userId provided in body
    if ('userId' in body || 'user_id' in body) {
      return NextResponse.json(
        {
          error: 'User ID cannot be provided in request body',
          code: 'USER_ID_NOT_ALLOWED',
        },
        { status: 400 }
      );
    }

    // Check campaign exists and belongs to user
    const existingCampaign = await db
      .select()
      .from(aiCampaigns)
      .where(
        and(
          eq(aiCampaigns.id, campaignId),
          eq(aiCampaigns.userId, session.user.id)
        )
      )
      .limit(1);

    if (existingCampaign.length === 0) {
      return NextResponse.json(
        { error: 'Campaign not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Extract allowed update fields
    const allowedFields = [
      'name',
      'goal',
      'targetAudience',
      'platforms',
      'contentStrategy',
      'postingSchedule',
      'budget',
      'status',
      'performanceMetrics',
    ];

    const updates: any = {};

    for (const field of allowedFields) {
      if (field in body) {
        updates[field] = body[field];
      }
    }

    // Validate at least one field is being updated
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update', code: 'NO_UPDATES' },
        { status: 400 }
      );
    }

    // Always update timestamp
    updates.updatedAt = new Date().toISOString();

    // Perform update
    const updatedCampaign = await db
      .update(aiCampaigns)
      .set(updates)
      .where(
        and(
          eq(aiCampaigns.id, campaignId),
          eq(aiCampaigns.userId, session.user.id)
        )
      )
      .returning();

    if (updatedCampaign.length === 0) {
      return NextResponse.json(
        { error: 'Failed to update campaign', code: 'UPDATE_FAILED' },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedCampaign[0], { status: 200 });
  } catch (error) {
    console.error('PATCH campaign error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authentication check
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    // Get and validate ID
    const { id } = await params;
    const campaignId = parseInt(id);

    if (!id || isNaN(campaignId)) {
      return NextResponse.json(
        { error: 'Valid campaign ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check campaign exists and belongs to user before deleting
    const existingCampaign = await db
      .select()
      .from(aiCampaigns)
      .where(
        and(
          eq(aiCampaigns.id, campaignId),
          eq(aiCampaigns.userId, session.user.id)
        )
      )
      .limit(1);

    if (existingCampaign.length === 0) {
      return NextResponse.json(
        { error: 'Campaign not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Perform deletion
    const deleted = await db
      .delete(aiCampaigns)
      .where(
        and(
          eq(aiCampaigns.id, campaignId),
          eq(aiCampaigns.userId, session.user.id)
        )
      )
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json(
        { error: 'Failed to delete campaign', code: 'DELETE_FAILED' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, campaign: deleted[0] },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE campaign error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}