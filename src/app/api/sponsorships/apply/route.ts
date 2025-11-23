import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { sponsorshipApplications, sponsorshipOpportunities } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { opportunityId, pitch, expectedReach, portfolioLinks } = body;

    // Validate required fields
    if (!opportunityId || !pitch || !expectedReach || !portfolioLinks) {
      return NextResponse.json(
        { 
          error: 'Missing required fields: opportunityId, pitch, expectedReach, portfolioLinks',
          code: 'MISSING_FIELDS'
        },
        { status: 400 }
      );
    }

    // Validate pitch length
    if (typeof pitch !== 'string' || pitch.trim().length < 50) {
      return NextResponse.json(
        { 
          error: 'Pitch must be at least 50 characters long',
          code: 'PITCH_TOO_SHORT'
        },
        { status: 400 }
      );
    }

    // Validate expectedReach
    const reachValue = parseInt(expectedReach);
    if (isNaN(reachValue) || reachValue <= 0) {
      return NextResponse.json(
        { 
          error: 'Expected reach must be a positive integer',
          code: 'INVALID_REACH'
        },
        { status: 400 }
      );
    }

    // Validate portfolioLinks
    if (!Array.isArray(portfolioLinks) || portfolioLinks.length === 0) {
      return NextResponse.json(
        { 
          error: 'Portfolio links must be an array with at least one URL',
          code: 'INVALID_PORTFOLIO'
        },
        { status: 400 }
      );
    }

    // Validate URL format for portfolio links
    const urlPattern = /^https?:\/\/.+/i;
    const invalidUrls = portfolioLinks.filter(link => !urlPattern.test(link));
    if (invalidUrls.length > 0) {
      return NextResponse.json(
        { 
          error: 'All portfolio links must be valid URLs',
          code: 'INVALID_PORTFOLIO'
        },
        { status: 400 }
      );
    }

    // Check if opportunity exists
    const opportunity = await db.select()
      .from(sponsorshipOpportunities)
      .where(eq(sponsorshipOpportunities.id, parseInt(opportunityId)))
      .limit(1);

    if (opportunity.length === 0) {
      return NextResponse.json(
        { 
          error: 'Sponsorship opportunity not found',
          code: 'OPPORTUNITY_NOT_FOUND'
        },
        { status: 400 }
      );
    }

    const opportunityData = opportunity[0];

    // Check if opportunity is active
    if (opportunityData.status !== 'active') {
      return NextResponse.json(
        { 
          error: 'This opportunity is not currently active',
          code: 'OPPORTUNITY_NOT_ACTIVE'
        },
        { status: 400 }
      );
    }

    // Prevent brand owner from applying to their own opportunity
    if (opportunityData.brandUserId === session.user.id) {
      return NextResponse.json(
        { 
          error: 'You cannot apply to your own sponsorship opportunity',
          code: 'CANNOT_APPLY_OWN_OPPORTUNITY'
        },
        { status: 400 }
      );
    }

    // Check if user has already applied
    const existingApplication = await db.select()
      .from(sponsorshipApplications)
      .where(
        and(
          eq(sponsorshipApplications.opportunityId, parseInt(opportunityId)),
          eq(sponsorshipApplications.influencerUserId, session.user.id)
        )
      )
      .limit(1);

    if (existingApplication.length > 0) {
      return NextResponse.json(
        { 
          error: 'You have already applied to this opportunity',
          code: 'ALREADY_APPLIED'
        },
        { status: 400 }
      );
    }

    // Check if opportunity has available slots
    if (opportunityData.slotsFilled >= opportunityData.slotsAvailable) {
      return NextResponse.json(
        { 
          error: 'This opportunity has no available slots remaining',
          code: 'NO_SLOTS_AVAILABLE'
        },
        { status: 400 }
      );
    }

    // Create the application
    const now = new Date().toISOString();
    const newApplication = await db.insert(sponsorshipApplications)
      .values({
        opportunityId: parseInt(opportunityId),
        influencerUserId: session.user.id,
        pitch: pitch.trim(),
        expectedReach: reachValue,
        portfolioLinks: portfolioLinks,
        status: 'pending',
        appliedAt: now
      })
      .returning();

    // Return created application with opportunity details
    return NextResponse.json(
      {
        ...newApplication[0],
        opportunity: opportunityData
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('POST sponsorship application error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}