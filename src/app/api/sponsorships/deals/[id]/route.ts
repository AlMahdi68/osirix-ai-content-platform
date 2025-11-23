import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { sponsorshipDeals, sponsorshipOpportunities, sponsorshipApplications, user } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Authentication check
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    // Get deal ID from params
    const { id } = await params;

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const dealId = parseInt(id);

    // Query deal with all related data using joins
    const dealResult = await db
      .select({
        // Deal fields
        id: sponsorshipDeals.id,
        agreedPayment: sponsorshipDeals.agreedPayment,
        deliverables: sponsorshipDeals.deliverables,
        status: sponsorshipDeals.status,
        contentUrls: sponsorshipDeals.contentUrls,
        paymentReleasedAt: sponsorshipDeals.paymentReleasedAt,
        createdAt: sponsorshipDeals.createdAt,
        updatedAt: sponsorshipDeals.updatedAt,
        
        // Opportunity fields
        opportunityId: sponsorshipOpportunities.id,
        opportunityTitle: sponsorshipOpportunities.title,
        opportunityDescription: sponsorshipOpportunities.description,
        opportunityCategory: sponsorshipOpportunities.category,
        opportunityRequirements: sponsorshipOpportunities.requirements,
        opportunityDurationDays: sponsorshipOpportunities.durationDays,
        
        // Application fields
        applicationId: sponsorshipApplications.id,
        applicationPitch: sponsorshipApplications.pitch,
        applicationExpectedReach: sponsorshipApplications.expectedReach,
        applicationPortfolioLinks: sponsorshipApplications.portfolioLinks,
        applicationAppliedAt: sponsorshipApplications.appliedAt,
        
        // Brand user fields
        brandUserId: sponsorshipDeals.brandUserId,
        
        // Influencer user fields
        influencerUserId: sponsorshipDeals.influencerUserId,
      })
      .from(sponsorshipDeals)
      .innerJoin(
        sponsorshipOpportunities,
        eq(sponsorshipDeals.opportunityId, sponsorshipOpportunities.id)
      )
      .innerJoin(
        sponsorshipApplications,
        eq(sponsorshipDeals.applicationId, sponsorshipApplications.id)
      )
      .where(eq(sponsorshipDeals.id, dealId))
      .limit(1);

    // Check if deal exists
    if (dealResult.length === 0) {
      return NextResponse.json(
        { error: 'Deal not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const dealData = dealResult[0];

    // Authorization check - user must be either brand or influencer
    const isParticipant =
      session.user.id === dealData.brandUserId ||
      session.user.id === dealData.influencerUserId;

    if (!isParticipant) {
      return NextResponse.json(
        { 
          error: 'You are not authorized to view this deal', 
          code: 'FORBIDDEN' 
        },
        { status: 403 }
      );
    }

    // Fetch brand user details
    const brandUserResult = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
      })
      .from(user)
      .where(eq(user.id, dealData.brandUserId))
      .limit(1);

    // Fetch influencer user details
    const influencerUserResult = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
      })
      .from(user)
      .where(eq(user.id, dealData.influencerUserId))
      .limit(1);

    // Check if users exist
    if (brandUserResult.length === 0 || influencerUserResult.length === 0) {
      return NextResponse.json(
        { error: 'Associated user not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Construct response object
    const deal = {
      id: dealData.id,
      agreedPayment: dealData.agreedPayment,
      deliverables: dealData.deliverables,
      status: dealData.status,
      contentUrls: dealData.contentUrls,
      paymentReleasedAt: dealData.paymentReleasedAt,
      createdAt: dealData.createdAt,
      updatedAt: dealData.updatedAt,
      opportunity: {
        id: dealData.opportunityId,
        title: dealData.opportunityTitle,
        description: dealData.opportunityDescription,
        category: dealData.opportunityCategory,
        requirements: dealData.opportunityRequirements,
        durationDays: dealData.opportunityDurationDays,
      },
      application: {
        id: dealData.applicationId,
        pitch: dealData.applicationPitch,
        expectedReach: dealData.applicationExpectedReach,
        portfolioLinks: dealData.applicationPortfolioLinks,
        appliedAt: dealData.applicationAppliedAt,
      },
      brand: brandUserResult[0],
      influencer: influencerUserResult[0],
    };

    return NextResponse.json(deal, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}