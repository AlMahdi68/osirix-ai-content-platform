import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { db } from '@/db';
import { aiCampaigns } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const statusFilter = searchParams.get('status');

    let query = db.select().from(aiCampaigns).where(eq(aiCampaigns.userId, session.user.id));

    if (statusFilter) {
      query = query.where(and(eq(aiCampaigns.userId, session.user.id), eq(aiCampaigns.status, statusFilter)));
    }

    const campaigns = await query
      .orderBy(desc(aiCampaigns.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({ campaigns });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();

    // Security check: reject if userId provided in body
    if ('userId' in body || 'user_id' in body) {
      return NextResponse.json({ 
        error: "User ID cannot be provided in request body",
        code: "USER_ID_NOT_ALLOWED" 
      }, { status: 400 });
    }

    const { name, goal, targetAudience, platforms, contentStrategy, postingSchedule, budget, status } = body;

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json({ 
        error: "Name is required and must be a non-empty string",
        code: "MISSING_NAME" 
      }, { status: 400 });
    }

    if (!goal || typeof goal !== 'string' || goal.trim() === '') {
      return NextResponse.json({ 
        error: "Goal is required and must be a non-empty string",
        code: "MISSING_GOAL" 
      }, { status: 400 });
    }

    if (!targetAudience || typeof targetAudience !== 'string' || targetAudience.trim() === '') {
      return NextResponse.json({ 
        error: "Target audience is required and must be a non-empty string",
        code: "MISSING_TARGET_AUDIENCE" 
      }, { status: 400 });
    }

    if (!platforms || !Array.isArray(platforms) || platforms.length === 0) {
      return NextResponse.json({ 
        error: "Platforms is required and must be a non-empty array",
        code: "INVALID_PLATFORMS" 
      }, { status: 400 });
    }

    if (!contentStrategy || typeof contentStrategy !== 'string' || contentStrategy.trim() === '') {
      return NextResponse.json({ 
        error: "Content strategy is required and must be a non-empty string",
        code: "MISSING_CONTENT_STRATEGY" 
      }, { status: 400 });
    }

    if (!postingSchedule || typeof postingSchedule !== 'object' || Array.isArray(postingSchedule)) {
      return NextResponse.json({ 
        error: "Posting schedule is required and must be an object",
        code: "INVALID_POSTING_SCHEDULE" 
      }, { status: 400 });
    }

    if (budget === undefined || budget === null || typeof budget !== 'number' || budget < 0 || !Number.isInteger(budget)) {
      return NextResponse.json({ 
        error: "Budget is required and must be a positive integer (in cents)",
        code: "INVALID_BUDGET" 
      }, { status: 400 });
    }

    // Validate status if provided
    const validStatuses = ['planning', 'active', 'paused', 'completed'];
    const campaignStatus = status || 'planning';
    if (!validStatuses.includes(campaignStatus)) {
      return NextResponse.json({ 
        error: `Status must be one of: ${validStatuses.join(', ')}`,
        code: "INVALID_STATUS" 
      }, { status: 400 });
    }

    const now = new Date().toISOString();

    const newCampaign = await db.insert(aiCampaigns)
      .values({
        userId: session.user.id,
        name: name.trim(),
        goal: goal.trim(),
        targetAudience: targetAudience.trim(),
        platforms: platforms,
        contentStrategy: contentStrategy.trim(),
        postingSchedule: postingSchedule,
        budget: budget,
        status: campaignStatus,
        performanceMetrics: null,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return NextResponse.json({ campaign: newCampaign[0] }, { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}