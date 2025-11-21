import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { db } from '@/db';
import { aiProducts } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Authentication check
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const status = searchParams.get('status');
    const category = searchParams.get('category');

    // Build query with user scoping
    let query = db
      .select()
      .from(aiProducts)
      .where(eq(aiProducts.userId, session.user.id))
      .orderBy(desc(aiProducts.createdAt));

    // Apply filters
    const conditions = [eq(aiProducts.userId, session.user.id)];
    
    if (status) {
      conditions.push(eq(aiProducts.status, status));
    }
    
    if (category) {
      conditions.push(eq(aiProducts.category, category));
    }

    if (conditions.length > 1) {
      query = db
        .select()
        .from(aiProducts)
        .where(and(...conditions))
        .orderBy(desc(aiProducts.createdAt));
    }

    const products = await query.limit(limit).offset(offset);

    return NextResponse.json({ products });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Security check: reject if userId provided in body
    if ('userId' in body || 'user_id' in body) {
      return NextResponse.json(
        {
          error: 'User ID cannot be provided in request body',
          code: 'USER_ID_NOT_ALLOWED',
        },
        { status: 400 }
      );
    }

    const {
      name,
      description,
      category,
      priceSuggestion,
      targetAudience,
      keyFeatures,
      marketingCopy,
      status = 'draft',
    } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required', code: 'MISSING_NAME' },
        { status: 400 }
      );
    }

    if (!description) {
      return NextResponse.json(
        { error: 'Description is required', code: 'MISSING_DESCRIPTION' },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        { error: 'Category is required', code: 'MISSING_CATEGORY' },
        { status: 400 }
      );
    }

    if (priceSuggestion === undefined || priceSuggestion === null) {
      return NextResponse.json(
        { error: 'Price suggestion is required', code: 'MISSING_PRICE_SUGGESTION' },
        { status: 400 }
      );
    }

    if (typeof priceSuggestion !== 'number' || priceSuggestion < 0) {
      return NextResponse.json(
        { error: 'Price suggestion must be a positive number', code: 'INVALID_PRICE_SUGGESTION' },
        { status: 400 }
      );
    }

    if (!targetAudience) {
      return NextResponse.json(
        { error: 'Target audience is required', code: 'MISSING_TARGET_AUDIENCE' },
        { status: 400 }
      );
    }

    if (!keyFeatures) {
      return NextResponse.json(
        { error: 'Key features are required', code: 'MISSING_KEY_FEATURES' },
        { status: 400 }
      );
    }

    if (!Array.isArray(keyFeatures)) {
      return NextResponse.json(
        { error: 'Key features must be an array', code: 'INVALID_KEY_FEATURES' },
        { status: 400 }
      );
    }

    if (!marketingCopy) {
      return NextResponse.json(
        { error: 'Marketing copy is required', code: 'MISSING_MARKETING_COPY' },
        { status: 400 }
      );
    }

    // Validate status field
    const validStatuses = ['draft', 'approved', 'published'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { 
          error: `Status must be one of: ${validStatuses.join(', ')}`, 
          code: 'INVALID_STATUS' 
        },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    // Create new product with userId from session
    const newProduct = await db
      .insert(aiProducts)
      .values({
        userId: session.user.id,
        name: name.trim(),
        description: description.trim(),
        category: category.trim(),
        priceSuggestion,
        targetAudience: targetAudience.trim(),
        keyFeatures: JSON.stringify(keyFeatures),
        marketingCopy: marketingCopy.trim(),
        status,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return NextResponse.json(
      { product: newProduct[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}