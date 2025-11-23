import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { db } from '@/db';
import { sponsorshipDeals } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Authentication check
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ 
        error: 'Authentication required',
        code: 'UNAUTHENTICATED' 
      }, { status: 401 });
    }

    const user = session.user;
    const body = await request.json();
    const { reason, evidence_urls } = body;

    // Get deal ID from params
    const { id } = await params;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: 'Valid deal ID is required',
        code: 'INVALID_ID' 
      }, { status: 400 });
    }

    const dealId = parseInt(id);

    // Validate required field: reason
    if (!reason) {
      return NextResponse.json({ 
        error: 'Dispute reason is required',
        code: 'MISSING_REASON' 
      }, { status: 400 });
    }

    // Validate reason length (minimum 50 characters)
    if (typeof reason !== 'string' || reason.trim().length < 50) {
      return NextResponse.json({ 
        error: 'Dispute reason must be at least 50 characters',
        code: 'REASON_TOO_SHORT' 
      }, { status: 400 });
    }

    // Fetch the deal
    const deal = await db.select()
      .from(sponsorshipDeals)
      .where(eq(sponsorshipDeals.id, dealId))
      .limit(1);

    if (deal.length === 0) {
      return NextResponse.json({ 
        error: 'Deal not found',
        code: 'DEAL_NOT_FOUND' 
      }, { status: 404 });
    }

    const currentDeal = deal[0];

    // Verify user is participant (brand or influencer)
    if (currentDeal.brandUserId !== user.id && currentDeal.influencerUserId !== user.id) {
      return NextResponse.json({ 
        error: 'You are not authorized to dispute this deal',
        code: 'UNAUTHORIZED_PARTICIPANT' 
      }, { status: 403 });
    }

    // Check if deal status is valid for dispute
    const validDisputeStatuses = ['active', 'content_submitted', 'approved'];
    if (!validDisputeStatuses.includes(currentDeal.status)) {
      return NextResponse.json({ 
        error: `Cannot dispute deals with status '${currentDeal.status}'. Only active, content_submitted, or approved deals can be disputed.`,
        code: 'INVALID_STATUS' 
      }, { status: 400 });
    }

    // Check if already disputed
    if (currentDeal.status === 'disputed') {
      return NextResponse.json({ 
        error: 'This deal is already disputed',
        code: 'ALREADY_DISPUTED' 
      }, { status: 400 });
    }

    // Parse existing deliverables to check for previous disputes
    let deliverables: any = {};
    try {
      deliverables = typeof currentDeal.deliverables === 'string' 
        ? JSON.parse(currentDeal.deliverables) 
        : currentDeal.deliverables || {};
    } catch (e) {
      deliverables = currentDeal.deliverables || {};
    }

    // Check if already disputed (in metadata)
    if (deliverables.disputedAt) {
      return NextResponse.json({ 
        error: 'This deal has already been disputed',
        code: 'ALREADY_DISPUTED' 
      }, { status: 400 });
    }

    // Prepare dispute information
    const disputeInfo = {
      ...deliverables,
      disputedBy: user.id,
      disputedAt: new Date().toISOString(),
      disputeReason: reason.trim(),
      evidenceUrls: evidence_urls || [],
      originalStatus: currentDeal.status,
    };

    // Update the deal with dispute information
    const updated = await db.update(sponsorshipDeals)
      .set({
        status: 'disputed',
        deliverables: disputeInfo,
        updatedAt: new Date().toISOString()
      })
      .where(eq(sponsorshipDeals.id, dealId))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ 
        error: 'Failed to update deal',
        code: 'UPDATE_FAILED' 
      }, { status: 500 });
    }

    return NextResponse.json({
      ...updated[0],
      message: 'Dispute opened successfully. Our team will review and contact you.',
      disputeDetails: {
        disputedBy: user.id,
        disputedAt: disputeInfo.disputedAt,
        disputeReason: disputeInfo.disputeReason,
        evidenceUrls: disputeInfo.evidenceUrls,
        originalStatus: disputeInfo.originalStatus
      }
    }, { status: 200 });

  } catch (error) {
    console.error('POST dispute error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}