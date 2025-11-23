import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { sponsorshipDeals, sponsorshipOpportunities, user } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

const VALID_STATUSES = ['active', 'content_submitted', 'approved', 'paid', 'disputed'];
const VALID_ROLES = ['influencer', 'brand'];

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user) {
      return NextResponse.json({ 
        error: 'Authentication required',
        code: 'AUTH_REQUIRED' 
      }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const role = searchParams.get('role');
    const status = searchParams.get('status');
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    if (role && !VALID_ROLES.includes(role)) {
      return NextResponse.json({ 
        error: 'Invalid role. Must be "influencer" or "brand"',
        code: 'INVALID_ROLE' 
      }, { status: 400 });
    }

    if (status && !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ 
        error: 'Invalid status. Must be one of: active, content_submitted, approved, paid, disputed',
        code: 'INVALID_STATUS' 
      }, { status: 400 });
    }

    if (isNaN(limit) || limit < 1) {
      return NextResponse.json({ 
        error: 'Invalid limit parameter',
        code: 'INVALID_LIMIT' 
      }, { status: 400 });
    }

    if (isNaN(offset) || offset < 0) {
      return NextResponse.json({ 
        error: 'Invalid offset parameter',
        code: 'INVALID_OFFSET' 
      }, { status: 400 });
    }

    const userRole = role || 'influencer';
    let whereConditions;

    if (userRole === 'brand') {
      whereConditions = status 
        ? and(
            eq(sponsorshipDeals.brandUserId, session.user.id),
            eq(sponsorshipDeals.status, status)
          )
        : eq(sponsorshipDeals.brandUserId, session.user.id);
    } else {
      whereConditions = status 
        ? and(
            eq(sponsorshipDeals.influencerUserId, session.user.id),
            eq(sponsorshipDeals.status, status)
          )
        : eq(sponsorshipDeals.influencerUserId, session.user.id);
    }

    const deals = await db
      .select({
        id: sponsorshipDeals.id,
        agreedPayment: sponsorshipDeals.agreedPayment,
        deliverables: sponsorshipDeals.deliverables,
        status: sponsorshipDeals.status,
        contentUrls: sponsorshipDeals.contentUrls,
        paymentReleasedAt: sponsorshipDeals.paymentReleasedAt,
        createdAt: sponsorshipDeals.createdAt,
        opportunity: {
          title: sponsorshipOpportunities.title,
          category: sponsorshipOpportunities.category,
          description: sponsorshipOpportunities.description,
        },
        brandUser: {
          name: user.name,
          email: user.email,
        },
      })
      .from(sponsorshipDeals)
      .innerJoin(
        sponsorshipOpportunities,
        eq(sponsorshipDeals.opportunityId, sponsorshipOpportunities.id)
      )
      .innerJoin(
        user,
        userRole === 'brand' 
          ? eq(sponsorshipDeals.influencerUserId, user.id)
          : eq(sponsorshipDeals.brandUserId, user.id)
      )
      .where(whereConditions)
      .orderBy(desc(sponsorshipDeals.createdAt))
      .limit(limit)
      .offset(offset);

    const formattedDeals = deals.map(deal => ({
      id: deal.id,
      agreedPayment: deal.agreedPayment,
      deliverables: deal.deliverables,
      status: deal.status,
      contentUrls: deal.contentUrls,
      paymentReleasedAt: deal.paymentReleasedAt,
      createdAt: deal.createdAt,
      opportunity: deal.opportunity,
      ...(userRole === 'brand' 
        ? { influencer: { name: deal.brandUser.name, email: deal.brandUser.email } }
        : { brand: { name: deal.brandUser.name, email: deal.brandUser.email } }
      ),
    }));

    return NextResponse.json(formattedDeals, { status: 200 });
  } catch (error) {
    console.error('GET sponsorship deals error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
      code: 'INTERNAL_ERROR' 
    }, { status: 500 });
  }
}