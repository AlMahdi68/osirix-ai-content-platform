import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { db } from '@/db';
import { sponsorshipDeals } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session) {
      return NextResponse.json({ 
        error: 'Authentication required',
        code: 'UNAUTHORIZED'
      }, { status: 401 });
    }

    const user = session.user;
    const body = await request.json();
    const { contentUrls } = body;
    
    const { id } = await params;

    // Validate required field
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: 'Valid deal ID is required',
        code: 'INVALID_ID'
      }, { status: 400 });
    }

    const dealId = parseInt(id);

    if (!contentUrls) {
      return NextResponse.json({ 
        error: 'Content URLs are required',
        code: 'MISSING_CONTENT_URLS'
      }, { status: 400 });
    }

    // Validate contentUrls is non-empty array
    if (!Array.isArray(contentUrls) || contentUrls.length === 0) {
      return NextResponse.json({ 
        error: 'Content URLs must be a non-empty array',
        code: 'INVALID_CONTENT_URLS'
      }, { status: 400 });
    }

    // Validate each URL format
    const urlPattern = /^https?:\/\/.+/i;
    const invalidUrls = contentUrls.filter(url => !urlPattern.test(url));
    
    if (invalidUrls.length > 0) {
      return NextResponse.json({ 
        error: 'All URLs must be valid and start with http:// or https://',
        code: 'INVALID_CONTENT_URLS'
      }, { status: 400 });
    }

    // Check if deal exists
    const existingDeal = await db.select()
      .from(sponsorshipDeals)
      .where(eq(sponsorshipDeals.id, dealId))
      .limit(1);

    if (existingDeal.length === 0) {
      return NextResponse.json({ 
        error: 'Deal not found',
        code: 'DEAL_NOT_FOUND'
      }, { status: 404 });
    }

    const deal = existingDeal[0];

    // Verify user is the influencer for this deal
    if (deal.influencerUserId !== user.id) {
      return NextResponse.json({ 
        error: 'Only the influencer can submit content for this deal',
        code: 'FORBIDDEN'
      }, { status: 403 });
    }

    // Validate deal status is 'active'
    if (deal.status !== 'active') {
      if (deal.status === 'content_submitted') {
        return NextResponse.json({ 
          error: 'Content has already been submitted for this deal',
          code: 'ALREADY_SUBMITTED'
        }, { status: 400 });
      }
      
      return NextResponse.json({ 
        error: `Can only submit content when deal status is 'active'. Current status: ${deal.status}`,
        code: 'INVALID_STATUS'
      }, { status: 400 });
    }

    // Update deal with content URLs and change status to 'content_submitted'
    const updatedDeal = await db.update(sponsorshipDeals)
      .set({
        contentUrls: contentUrls,
        status: 'content_submitted',
        updatedAt: new Date().toISOString()
      })
      .where(and(
        eq(sponsorshipDeals.id, dealId),
        eq(sponsorshipDeals.influencerUserId, user.id)
      ))
      .returning();

    if (updatedDeal.length === 0) {
      return NextResponse.json({ 
        error: 'Failed to update deal',
        code: 'UPDATE_FAILED'
      }, { status: 500 });
    }

    return NextResponse.json(updatedDeal[0], { status: 200 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}