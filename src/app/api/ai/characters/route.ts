import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { db } from '@/db';
import { aiCharacters } from '@/db/schema';
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

    // Get AI characters for authenticated user with pagination
    const characters = await db.select()
      .from(aiCharacters)
      .where(eq(aiCharacters.userId, session.user.id))
      .orderBy(desc(aiCharacters.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({ characters });
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
    const { name, personality, backstory, voiceStyle, traits, useCases, avatarId } = body;

    // Security check: reject if userId provided in body
    if ('userId' in body || 'user_id' in body) {
      return NextResponse.json({ 
        error: "User ID cannot be provided in request body",
        code: "USER_ID_NOT_ALLOWED" 
      }, { status: 400 });
    }

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json({ 
        error: "Name is required and must be a non-empty string",
        code: "MISSING_NAME" 
      }, { status: 400 });
    }

    if (!personality || typeof personality !== 'string' || personality.trim() === '') {
      return NextResponse.json({ 
        error: "Personality is required and must be a non-empty string",
        code: "MISSING_PERSONALITY" 
      }, { status: 400 });
    }

    if (!backstory || typeof backstory !== 'string' || backstory.trim() === '') {
      return NextResponse.json({ 
        error: "Backstory is required and must be a non-empty string",
        code: "MISSING_BACKSTORY" 
      }, { status: 400 });
    }

    if (!voiceStyle || typeof voiceStyle !== 'string' || voiceStyle.trim() === '') {
      return NextResponse.json({ 
        error: "Voice style is required and must be a non-empty string",
        code: "MISSING_VOICE_STYLE" 
      }, { status: 400 });
    }

    if (!traits || !Array.isArray(traits)) {
      return NextResponse.json({ 
        error: "Traits is required and must be an array",
        code: "INVALID_TRAITS" 
      }, { status: 400 });
    }

    if (!useCases || !Array.isArray(useCases)) {
      return NextResponse.json({ 
        error: "Use cases is required and must be an array",
        code: "INVALID_USE_CASES" 
      }, { status: 400 });
    }

    // Validate avatarId if provided
    if (avatarId !== undefined && avatarId !== null) {
      if (!Number.isInteger(avatarId) || avatarId <= 0) {
        return NextResponse.json({ 
          error: "Avatar ID must be a positive integer",
          code: "INVALID_AVATAR_ID" 
        }, { status: 400 });
      }
    }

    const now = new Date().toISOString();

    // Create new AI character
    const newCharacter = await db.insert(aiCharacters)
      .values({
        userId: session.user.id,
        name: name.trim(),
        personality: personality.trim(),
        backstory: backstory.trim(),
        voiceStyle: voiceStyle.trim(),
        traits: JSON.stringify(traits),
        useCases: JSON.stringify(useCases),
        avatarId: avatarId ?? null,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return NextResponse.json({ character: newCharacter[0] }, { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}