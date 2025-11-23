import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { sponsorshipApplications, sponsorshipOpportunities, user } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Authentication check
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHENTICATED' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const searchParams = request.nextUrl.searchParams;

    // Parse query parameters
    const role = searchParams.get('role') || 'influencer';
    const status = searchParams.get('status');
    const opportunityId = searchParams.get('opportunityId');
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    // Validate role parameter
    if (role !== 'influencer' && role !== 'brand') {
      return NextResponse.json(
        { error: 'Invalid role parameter. Must be "influencer" or "brand"', code: 'INVALID_ROLE' },
        { status: 400 }
      );
    }

    if (role === 'influencer') {
      // Return applications made by the influencer
      let query = db
        .select({
          id: sponsorshipApplications.id,
          pitch: sponsorshipApplications.pitch,
          expectedReach: sponsorshipApplications.expectedReach,
          portfolioLinks: sponsorshipApplications.portfolioLinks,
          status: sponsorshipApplications.status,
          appliedAt: sponsorshipApplications.appliedAt,
          reviewedAt: sponsorshipApplications.reviewedAt,
          completedAt: sponsorshipApplications.completedAt,
          opportunity: {
            id: sponsorshipOpportunities.id,
            title: sponsorshipOpportunities.title,
            category: sponsorshipOpportunities.category,
            budgetMin: sponsorshipOpportunities.budgetMin,
            budgetMax: sponsorshipOpportunities.budgetMax,
            description: sponsorshipOpportunities.description,
            requirements: sponsorshipOpportunities.requirements,
            durationDays: sponsorshipOpportunities.durationDays,
          },
          brand: {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          }
        })
        .from(sponsorshipApplications)
        .innerJoin(
          sponsorshipOpportunities,
          eq(sponsorshipApplications.opportunityId, sponsorshipOpportunities.id)
        )
        .innerJoin(
          user,
          eq(sponsorshipOpportunities.brandUserId, user.id)
        )
        .$dynamic();

      // Build where conditions
      const conditions = [eq(sponsorshipApplications.influencerUserId, userId)];

      if (status) {
        conditions.push(eq(sponsorshipApplications.status, status));
      }

      if (opportunityId) {
        const oppIdNum = parseInt(opportunityId);
        if (isNaN(oppIdNum)) {
          return NextResponse.json(
            { error: 'Invalid opportunityId parameter', code: 'INVALID_OPPORTUNITY_ID' },
            { status: 400 }
          );
        }
        conditions.push(eq(sponsorshipApplications.opportunityId, oppIdNum));
      }

      query = query.where(and(...conditions));

      // Apply ordering and pagination
      const applications = await query
        .orderBy(desc(sponsorshipApplications.appliedAt))
        .limit(limit)
        .offset(offset);

      return NextResponse.json(applications, { status: 200 });

    } else {
      // role === 'brand' - Return applications for opportunities owned by the brand
      let query = db
        .select({
          id: sponsorshipApplications.id,
          pitch: sponsorshipApplications.pitch,
          expectedReach: sponsorshipApplications.expectedReach,
          portfolioLinks: sponsorshipApplications.portfolioLinks,
          status: sponsorshipApplications.status,
          appliedAt: sponsorshipApplications.appliedAt,
          reviewedAt: sponsorshipApplications.reviewedAt,
          completedAt: sponsorshipApplications.completedAt,
          opportunity: {
            id: sponsorshipOpportunities.id,
            title: sponsorshipOpportunities.title,
            category: sponsorshipOpportunities.category,
            budgetMin: sponsorshipOpportunities.budgetMin,
            budgetMax: sponsorshipOpportunities.budgetMax,
          },
          influencer: {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          }
        })
        .from(sponsorshipApplications)
        .innerJoin(
          sponsorshipOpportunities,
          eq(sponsorshipApplications.opportunityId, sponsorshipOpportunities.id)
        )
        .innerJoin(
          user,
          eq(sponsorshipApplications.influencerUserId, user.id)
        )
        .$dynamic();

      // Build where conditions - must be for opportunities owned by this brand user
      const conditions = [eq(sponsorshipOpportunities.brandUserId, userId)];

      if (status) {
        conditions.push(eq(sponsorshipApplications.status, status));
      }

      if (opportunityId) {
        const oppIdNum = parseInt(opportunityId);
        if (isNaN(oppIdNum)) {
          return NextResponse.json(
            { error: 'Invalid opportunityId parameter', code: 'INVALID_OPPORTUNITY_ID' },
            { status: 400 }
          );
        }
        conditions.push(eq(sponsorshipApplications.opportunityId, oppIdNum));
      }

      query = query.where(and(...conditions));

      // Apply ordering and pagination
      const applications = await query
        .orderBy(desc(sponsorshipApplications.appliedAt))
        .limit(limit)
        .offset(offset);

      return NextResponse.json(applications, { status: 200 });
    }

  } catch (error) {
    console.error('GET /api/sponsorship-applications error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}