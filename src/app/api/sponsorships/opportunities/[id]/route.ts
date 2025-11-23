import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { db } from '@/db';
import { sponsorshipOpportunities, sponsorshipApplications, sponsorshipDeals, user } from '@/db/schema';
import { eq, and, sql, count } from 'drizzle-orm';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const opportunityId = parseInt(id);

    // Query opportunity with brand user info and application count
    const result = await db.select({
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
      applicationCount: sql<number>`cast(count(distinct ${sponsorshipApplications.id}) as integer)`
    })
    .from(sponsorshipOpportunities)
    .leftJoin(user, eq(sponsorshipOpportunities.brandUserId, user.id))
    .leftJoin(sponsorshipApplications, eq(sponsorshipApplications.opportunityId, sponsorshipOpportunities.id))
    .where(eq(sponsorshipOpportunities.id, opportunityId))
    .groupBy(
      sponsorshipOpportunities.id,
      sponsorshipOpportunities.brandUserId,
      sponsorshipOpportunities.title,
      sponsorshipOpportunities.description,
      sponsorshipOpportunities.category,
      sponsorshipOpportunities.budgetMin,
      sponsorshipOpportunities.budgetMax,
      sponsorshipOpportunities.requirements,
      sponsorshipOpportunities.durationDays,
      sponsorshipOpportunities.slotsAvailable,
      sponsorshipOpportunities.slotsFilled,
      sponsorshipOpportunities.status,
      sponsorshipOpportunities.createdAt,
      sponsorshipOpportunities.updatedAt,
      user.name,
      user.email,
      user.image
    )
    .limit(1);

    if (result.length === 0) {
      return NextResponse.json({ 
        error: 'Opportunity not found',
        code: 'NOT_FOUND' 
      }, { status: 404 });
    }

    return NextResponse.json(result[0], { status: 200 });
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
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const opportunityId = parseInt(id);

    // Check if opportunity exists and belongs to user
    const existing = await db.select()
      .from(sponsorshipOpportunities)
      .where(eq(sponsorshipOpportunities.id, opportunityId))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ 
        error: 'Opportunity not found',
        code: 'NOT_FOUND' 
      }, { status: 404 });
    }

    if (existing[0].brandUserId !== session.user.id) {
      return NextResponse.json({ 
        error: 'You do not have permission to update this opportunity',
        code: 'FORBIDDEN' 
      }, { status: 403 });
    }

    const body = await request.json();
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

    // Validate budgets if both provided
    if (budgetMin !== undefined && budgetMax !== undefined) {
      if (budgetMin >= budgetMax) {
        return NextResponse.json({ 
          error: 'budgetMin must be less than budgetMax',
          code: 'INVALID_BUDGET_RANGE' 
        }, { status: 400 });
      }
    }

    // Validate budgetMin with existing budgetMax
    if (budgetMin !== undefined && budgetMax === undefined) {
      if (budgetMin >= existing[0].budgetMax) {
        return NextResponse.json({ 
          error: 'budgetMin must be less than existing budgetMax',
          code: 'INVALID_BUDGET_RANGE' 
        }, { status: 400 });
      }
    }

    // Validate budgetMax with existing budgetMin
    if (budgetMax !== undefined && budgetMin === undefined) {
      if (existing[0].budgetMin >= budgetMax) {
        return NextResponse.json({ 
          error: 'budgetMax must be greater than existing budgetMin',
          code: 'INVALID_BUDGET_RANGE' 
        }, { status: 400 });
      }
    }

    // Validate slotsAvailable > slotsFilled
    if (slotsAvailable !== undefined) {
      if (slotsAvailable < existing[0].slotsFilled) {
        return NextResponse.json({ 
          error: 'slotsAvailable cannot be less than slotsFilled',
          code: 'INVALID_SLOTS' 
        }, { status: 400 });
      }
    }

    // Build update object with only provided fields
    const updates: Record<string, any> = {
      updatedAt: new Date().toISOString()
    };

    if (title !== undefined) updates.title = title.trim();
    if (description !== undefined) updates.description = description.trim();
    if (category !== undefined) updates.category = category.trim();
    if (budgetMin !== undefined) updates.budgetMin = budgetMin;
    if (budgetMax !== undefined) updates.budgetMax = budgetMax;
    if (requirements !== undefined) updates.requirements = requirements;
    if (durationDays !== undefined) updates.durationDays = durationDays;
    if (slotsAvailable !== undefined) updates.slotsAvailable = slotsAvailable;
    if (status !== undefined) updates.status = status;

    const updated = await db.update(sponsorshipOpportunities)
      .set(updates)
      .where(eq(sponsorshipOpportunities.id, opportunityId))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const opportunityId = parseInt(id);

    // Check if opportunity exists and belongs to user
    const existing = await db.select()
      .from(sponsorshipOpportunities)
      .where(eq(sponsorshipOpportunities.id, opportunityId))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ 
        error: 'Opportunity not found',
        code: 'NOT_FOUND' 
      }, { status: 404 });
    }

    if (existing[0].brandUserId !== session.user.id) {
      return NextResponse.json({ 
        error: 'You do not have permission to cancel this opportunity',
        code: 'FORBIDDEN' 
      }, { status: 403 });
    }

    // Check for active deals
    const activeDeals = await db.select()
      .from(sponsorshipDeals)
      .where(
        and(
          eq(sponsorshipDeals.opportunityId, opportunityId),
          eq(sponsorshipDeals.status, 'active')
        )
      )
      .limit(1);

    if (activeDeals.length > 0) {
      return NextResponse.json({ 
        error: 'Cannot cancel opportunity with active deals',
        code: 'HAS_ACTIVE_DEALS' 
      }, { status: 400 });
    }

    // Update status to cancelled
    const cancelled = await db.update(sponsorshipOpportunities)
      .set({
        status: 'cancelled',
        updatedAt: new Date().toISOString()
      })
      .where(eq(sponsorshipOpportunities.id, opportunityId))
      .returning();

    return NextResponse.json({
      message: 'Opportunity cancelled successfully',
      opportunity: cancelled[0]
    }, { status: 200 });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}