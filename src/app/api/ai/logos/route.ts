import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { db } from '@/db';
import { aiLogos } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Authentication check
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const statusFilter = searchParams.get('status');
    const styleFilter = searchParams.get('style');

    // Build query with user scoping
    let query = db.select().from(aiLogos).where(eq(aiLogos.userId, session.user.id));

    // Apply filters
    const conditions = [eq(aiLogos.userId, session.user.id)];
    
    if (statusFilter) {
      conditions.push(eq(aiLogos.status, statusFilter));
    }
    
    if (styleFilter) {
      conditions.push(eq(aiLogos.style, styleFilter));
    }

    // Execute query with filters
    const logos = await db.select()
      .from(aiLogos)
      .where(and(...conditions))
      .orderBy(desc(aiLogos.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({ logos });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();

    // Security check: reject if userId provided in body
    if ('userId' in body || 'user_id' in body) {
      return NextResponse.json({ 
        error: "User ID cannot be provided in request body",
        code: "USER_ID_NOT_ALLOWED" 
      }, { status: 400 });
    }

    const { name, prompt, style, colors, status } = body;

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json({ 
        error: "Name is required and must be a non-empty string",
        code: "MISSING_NAME" 
      }, { status: 400 });
    }

    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      return NextResponse.json({ 
        error: "Prompt is required and must be a non-empty string",
        code: "MISSING_PROMPT" 
      }, { status: 400 });
    }

    if (!style || typeof style !== 'string' || style.trim() === '') {
      return NextResponse.json({ 
        error: "Style is required and must be a non-empty string",
        code: "MISSING_STYLE" 
      }, { status: 400 });
    }

    if (!colors || !Array.isArray(colors)) {
      return NextResponse.json({ 
        error: "Colors is required and must be an array",
        code: "INVALID_COLORS" 
      }, { status: 400 });
    }

    // Validate status if provided
    const validStatuses = ['generating', 'completed', 'failed'];
    const logoStatus = status || 'generating';
    if (!validStatuses.includes(logoStatus)) {
      return NextResponse.json({ 
        error: `Status must be one of: ${validStatuses.join(', ')}`,
        code: "INVALID_STATUS" 
      }, { status: 400 });
    }

    // Create new AI logo
    const now = new Date().toISOString();
    const newLogo = await db.insert(aiLogos)
      .values({
        userId: session.user.id,
        name: name.trim(),
        prompt: prompt.trim(),
        style: style.trim(),
        colors: colors,
        status: logoStatus,
        imageUrl: null,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return NextResponse.json({ logo: newLogo[0] }, { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}