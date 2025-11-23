import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { db } from '@/db';
import { sponsorshipOpportunities, user } from '@/db/schema';
import { eq, and, gte, lte, desc } from 'drizzle-orm';

const VALID_CATEGORIES = [
  'fashion',
  'tech',
  'fitness',
  'beauty',
  'gaming',
  'lifestyle',
  'travel',
  'food',
  'health',
  'education'
];

const VALID_STATUSES = ['active', 'paused', 'completed', 'cancelled'];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Pagination parameters
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    // Filter parameters
    const category = searchParams.get('category');
    const budgetMin = searchParams.get('budgetMin');
    const budgetMax = searchParams.get('budgetMax');
    const status = searchParams.get('status') ?? 'active';

    // Build filter conditions
    const conditions = [];

    // Default to active status
    conditions.push(eq(sponsorshipOpportunities.status, status));

    if (category) {
      if (!VALID_CATEGORIES.includes(category)) {
        return NextResponse.json(
          {
            error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`,
            code: 'INVALID_CATEGORY'
          },
          { status: 400 }
        );
      }
      conditions.push(eq(sponsorshipOpportunities.category, category));
    }

    if (budgetMin) {
      const minBudget = parseInt(budgetMin);
      if (isNaN(minBudget) || minBudget < 0) {
        return NextResponse.json(
          {
            error: 'budgetMin must be a valid non-negative number',
            code: 'INVALID_BUDGET_MIN'
          },
          { status: 400 }
        );
      }
      conditions.push(gte(sponsorshipOpportunities.budgetMax, minBudget));
    }

    if (budgetMax) {
      const maxBudget = parseInt(budgetMax);
      if (isNaN(maxBudget) || maxBudget < 0) {
        return NextResponse.json(
          {
            error: 'budgetMax must be a valid non-negative number',
            code: 'INVALID_BUDGET_MAX'
          },
          { status: 400 }
        );
      }
      conditions.push(lte(sponsorshipOpportunities.budgetMin, maxBudget));
    }

    // Query with join to user table
    const opportunities = await db
      .select({
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
        createdAt: sponsorshipOpportunities.createdAt,
        updatedAt: sponsorshipOpportunities.updatedAt,
        brandName: user.name,
        brandEmail: user.email,
        brandImage: user.image,
      })
      .from(sponsorshipOpportunities)
      .leftJoin(user, eq(sponsorshipOpportunities.brandUserId, user.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(sponsorshipOpportunities.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(opportunities, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error as Error).message
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user) {
      return NextResponse.json(
        {
          error: 'Authentication required',
          code: 'UNAUTHORIZED'
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      'title',
      'description',
      'category',
      'budgetMin',
      'budgetMax',
      'requirements',
      'durationDays',
      'slotsAvailable'
    ];

    for (const field of requiredFields) {
      if (!(field in body) || body[field] === null || body[field] === undefined || body[field] === '') {
        return NextResponse.json(
          {
            error: `Missing required field: ${field}`,
            code: 'MISSING_REQUIRED_FIELD'
          },
          { status: 400 }
        );
      }
    }

    const {
      title,
      description,
      category,
      budgetMin,
      budgetMax,
      requirements,
      durationDays,
      slotsAvailable,
      status
    } = body;

    // Validate category
    if (!VALID_CATEGORIES.includes(category)) {
      return NextResponse.json(
        {
          error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`,
          code: 'INVALID_CATEGORY'
        },
        { status: 400 }
      );
    }

    // Validate status if provided
    if (status && !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        {
          error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
          code: 'INVALID_STATUS'
        },
        { status: 400 }
      );
    }

    // Validate budgetMin and budgetMax
    if (typeof budgetMin !== 'number' || budgetMin < 0) {
      return NextResponse.json(
        {
          error: 'budgetMin must be a non-negative number',
          code: 'INVALID_BUDGET_MIN'
        },
        { status: 400 }
      );
    }

    if (typeof budgetMax !== 'number' || budgetMax < 0) {
      return NextResponse.json(
        {
          error: 'budgetMax must be a non-negative number',
          code: 'INVALID_BUDGET_MAX'
        },
        { status: 400 }
      );
    }

    if (budgetMin >= budgetMax) {
      return NextResponse.json(
        {
          error: 'budgetMin must be less than budgetMax',
          code: 'INVALID_BUDGET_RANGE'
        },
        { status: 400 }
      );
    }

    // Validate slotsAvailable
    if (typeof slotsAvailable !== 'number' || slotsAvailable <= 0 || !Number.isInteger(slotsAvailable)) {
      return NextResponse.json(
        {
          error: 'slotsAvailable must be a positive integer',
          code: 'INVALID_SLOTS_AVAILABLE'
        },
        { status: 400 }
      );
    }

    // Validate durationDays
    if (typeof durationDays !== 'number' || durationDays <= 0 || !Number.isInteger(durationDays)) {
      return NextResponse.json(
        {
          error: 'durationDays must be a positive integer',
          code: 'INVALID_DURATION_DAYS'
        },
        { status: 400 }
      );
    }

    // Validate requirements (should be an object or array)
    if (typeof requirements !== 'object') {
      return NextResponse.json(
        {
          error: 'requirements must be a valid JSON object or array',
          code: 'INVALID_REQUIREMENTS'
        },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedTitle = title.trim();
    const sanitizedDescription = description.trim();

    if (!sanitizedTitle || !sanitizedDescription) {
      return NextResponse.json(
        {
          error: 'title and description cannot be empty',
          code: 'EMPTY_FIELDS'
        },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    // Create new sponsorship opportunity
    const newOpportunity = await db
      .insert(sponsorshipOpportunities)
      .values({
        brandUserId: session.user.id,
        title: sanitizedTitle,
        description: sanitizedDescription,
        category,
        budgetMin,
        budgetMax,
        requirements,
        durationDays,
        slotsAvailable,
        slotsFilled: 0,
        status: status || 'active',
        createdAt: now,
        updatedAt: now
      })
      .returning();

    // Fetch the created opportunity with brand details
    const opportunityWithBrand = await db
      .select({
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
        createdAt: sponsorshipOpportunities.createdAt,
        updatedAt: sponsorshipOpportunities.updatedAt,
        brandName: user.name,
        brandEmail: user.email,
        brandImage: user.image,
      })
      .from(sponsorshipOpportunities)
      .leftJoin(user, eq(sponsorshipOpportunities.brandUserId, user.id))
      .where(eq(sponsorshipOpportunities.id, newOpportunity[0].id))
      .limit(1);

    return NextResponse.json(opportunityWithBrand[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error as Error).message
      },
      { status: 500 }
    );
  }
}