import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { sponsorshipApplications, sponsorshipOpportunities, sponsorshipDeals, user } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    const { id } = await params;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: 'Valid application ID is required',
        code: 'INVALID_ID' 
      }, { status: 400 });
    }

    const applicationId = parseInt(id);

    // Fetch application with opportunity and influencer details
    const application = await db.select({
      id: sponsorshipApplications.id,
      opportunityId: sponsorshipApplications.opportunityId,
      influencerUserId: sponsorshipApplications.influencerUserId,
      pitch: sponsorshipApplications.pitch,
      expectedReach: sponsorshipApplications.expectedReach,
      portfolioLinks: sponsorshipApplications.portfolioLinks,
      status: sponsorshipApplications.status,
      appliedAt: sponsorshipApplications.appliedAt,
      reviewedAt: sponsorshipApplications.reviewedAt,
      completedAt: sponsorshipApplications.completedAt,
      opportunity: {
        id: sponsorshipOpportunities.id,
        brandUserId: sponsorshipOpportunities.brandUserId,
        title: sponsorshipOpportunities.title,
        description: sponsorshipOpportunities.description,
        category: sponsorshipOpportunities.category,
        budgetMin: sponsorshipOpportunities.budgetMin,
        budgetMax: sponsorshipOpportunities.budgetMax,
        requirements: sponsorshipOpportunities.requirements,
        durationDays: sponsorshipOpportunities.durationDays,
        slotsAvailable: sponsorshipOpportunities.slotsAvailable,
        slotsFilled: sponsorshipOpportunities.slotsFilled,
        status: sponsorshipOpportunities.status,
      },
      influencer: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      }
    })
    .from(sponsorshipApplications)
    .innerJoin(sponsorshipOpportunities, eq(sponsorshipApplications.opportunityId, sponsorshipOpportunities.id))
    .innerJoin(user, eq(sponsorshipApplications.influencerUserId, user.id))
    .where(eq(sponsorshipApplications.id, applicationId))
    .limit(1);

    if (application.length === 0) {
      return NextResponse.json({ 
        error: 'Application not found',
        code: 'NOT_FOUND' 
      }, { status: 404 });
    }

    const applicationData = application[0];

    // Check authorization: must be application owner (influencer) or opportunity owner (brand)
    const isInfluencer = applicationData.influencerUserId === session.user.id;
    const isBrand = applicationData.opportunity.brandUserId === session.user.id;

    if (!isInfluencer && !isBrand) {
      return NextResponse.json({ 
        error: 'You are not authorized to view this application',
        code: 'UNAUTHORIZED' 
      }, { status: 403 });
    }

    return NextResponse.json(applicationData, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    const { id } = await params;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: 'Valid application ID is required',
        code: 'INVALID_ID' 
      }, { status: 400 });
    }

    const applicationId = parseInt(id);
    const { status: newStatus, agreedPayment } = await request.json();

    if (!newStatus) {
      return NextResponse.json({ 
        error: 'Status is required',
        code: 'MISSING_STATUS' 
      }, { status: 400 });
    }

    // Fetch application with opportunity details
    const application = await db.select({
      id: sponsorshipApplications.id,
      opportunityId: sponsorshipApplications.opportunityId,
      influencerUserId: sponsorshipApplications.influencerUserId,
      status: sponsorshipApplications.status,
      opportunity: {
        id: sponsorshipOpportunities.id,
        brandUserId: sponsorshipOpportunities.brandUserId,
        budgetMax: sponsorshipOpportunities.budgetMax,
        requirements: sponsorshipOpportunities.requirements,
        slotsAvailable: sponsorshipOpportunities.slotsAvailable,
        slotsFilled: sponsorshipOpportunities.slotsFilled,
      }
    })
    .from(sponsorshipApplications)
    .innerJoin(sponsorshipOpportunities, eq(sponsorshipApplications.opportunityId, sponsorshipOpportunities.id))
    .where(eq(sponsorshipApplications.id, applicationId))
    .limit(1);

    if (application.length === 0) {
      return NextResponse.json({ 
        error: 'Application not found',
        code: 'NOT_FOUND' 
      }, { status: 404 });
    }

    const applicationData = application[0];

    // Check authorization: only opportunity owner (brand) can update
    if (applicationData.opportunity.brandUserId !== session.user.id) {
      return NextResponse.json({ 
        error: 'Only the brand owner can update application status',
        code: 'UNAUTHORIZED' 
      }, { status: 403 });
    }

    const currentStatus = applicationData.status;

    // Validate status transitions
    const validTransitions: Record<string, string[]> = {
      'pending': ['accepted', 'rejected'],
      'accepted': ['completed'],
    };

    if (!validTransitions[currentStatus] || !validTransitions[currentStatus].includes(newStatus)) {
      return NextResponse.json({ 
        error: `Invalid status transition from ${currentStatus} to ${newStatus}`,
        code: 'INVALID_STATUS_TRANSITION' 
      }, { status: 400 });
    }

    // Check if already reviewed
    if (currentStatus === 'rejected' || currentStatus === 'completed') {
      return NextResponse.json({ 
        error: 'Application has already been reviewed',
        code: 'ALREADY_REVIEWED' 
      }, { status: 400 });
    }

    const now = new Date().toISOString();
    let updatedApplication;

    // Handle different status transitions
    if (newStatus === 'accepted') {
      // Validate slots available
      if (applicationData.opportunity.slotsFilled >= applicationData.opportunity.slotsAvailable) {
        return NextResponse.json({ 
          error: 'No slots available for this opportunity',
          code: 'NO_SLOTS_AVAILABLE' 
        }, { status: 400 });
      }

      // Update application status
      updatedApplication = await db.update(sponsorshipApplications)
        .set({
          status: newStatus,
          reviewedAt: now,
        })
        .where(eq(sponsorshipApplications.id, applicationId))
        .returning();

      // Increment slotsFilled on opportunity
      await db.update(sponsorshipOpportunities)
        .set({
          slotsFilled: applicationData.opportunity.slotsFilled + 1,
          updatedAt: now,
        })
        .where(eq(sponsorshipOpportunities.id, applicationData.opportunityId));

      // Create sponsorship deal
      const paymentAmount = agreedPayment || applicationData.opportunity.budgetMax;
      
      await db.insert(sponsorshipDeals)
        .values({
          applicationId: applicationId,
          opportunityId: applicationData.opportunityId,
          brandUserId: applicationData.opportunity.brandUserId,
          influencerUserId: applicationData.influencerUserId,
          agreedPayment: paymentAmount,
          deliverables: applicationData.opportunity.requirements,
          status: 'active',
          contentUrls: [],
          createdAt: now,
          updatedAt: now,
        });

    } else if (newStatus === 'rejected') {
      // Update application status with reviewedAt
      updatedApplication = await db.update(sponsorshipApplications)
        .set({
          status: newStatus,
          reviewedAt: now,
        })
        .where(eq(sponsorshipApplications.id, applicationId))
        .returning();

    } else if (newStatus === 'completed') {
      // Update application status with completedAt
      updatedApplication = await db.update(sponsorshipApplications)
        .set({
          status: newStatus,
          completedAt: now,
        })
        .where(eq(sponsorshipApplications.id, applicationId))
        .returning();
    }

    if (!updatedApplication || updatedApplication.length === 0) {
      return NextResponse.json({ 
        error: 'Failed to update application',
        code: 'UPDATE_FAILED' 
      }, { status: 500 });
    }

    return NextResponse.json(updatedApplication[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}