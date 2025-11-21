import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { db } from '@/db';
import { aiCharacters } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { id } = await params;
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: 'Valid ID is required',
        code: 'INVALID_ID' 
      }, { status: 400 });
    }

    const character = await db.select()
      .from(aiCharacters)
      .where(
        and(
          eq(aiCharacters.id, parseInt(id)),
          eq(aiCharacters.userId, session.user.id)
        )
      )
      .limit(1);

    if (character.length === 0) {
      return NextResponse.json({ error: 'Character not found' }, { status: 404 });
    }

    return NextResponse.json({ character: character[0] });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { id } = await params;
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: 'Valid ID is required',
        code: 'INVALID_ID' 
      }, { status: 400 });
    }

    const body = await request.json();

    if ('userId' in body || 'user_id' in body) {
      return NextResponse.json({ 
        error: "User ID cannot be provided in request body",
        code: "USER_ID_NOT_ALLOWED" 
      }, { status: 400 });
    }

    const existingCharacter = await db.select()
      .from(aiCharacters)
      .where(
        and(
          eq(aiCharacters.id, parseInt(id)),
          eq(aiCharacters.userId, session.user.id)
        )
      )
      .limit(1);

    if (existingCharacter.length === 0) {
      return NextResponse.json({ error: 'Character not found' }, { status: 404 });
    }

    const allowedFields = ['name', 'personality', 'backstory', 'voiceStyle', 'avatarId', 'traits', 'useCases'];
    const updates: Record<string, any> = {};

    for (const field of allowedFields) {
      if (field in body) {
        updates[field] = body[field];
      }
    }

    updates.updatedAt = new Date().toISOString();

    const updatedCharacter = await db.update(aiCharacters)
      .set(updates)
      .where(
        and(
          eq(aiCharacters.id, parseInt(id)),
          eq(aiCharacters.userId, session.user.id)
        )
      )
      .returning();

    if (updatedCharacter.length === 0) {
      return NextResponse.json({ error: 'Character not found' }, { status: 404 });
    }

    return NextResponse.json(updatedCharacter[0]);
  } catch (error) {
    console.error('PATCH error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { id } = await params;
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: 'Valid ID is required',
        code: 'INVALID_ID' 
      }, { status: 400 });
    }

    const existingCharacter = await db.select()
      .from(aiCharacters)
      .where(
        and(
          eq(aiCharacters.id, parseInt(id)),
          eq(aiCharacters.userId, session.user.id)
        )
      )
      .limit(1);

    if (existingCharacter.length === 0) {
      return NextResponse.json({ error: 'Character not found' }, { status: 404 });
    }

    const deleted = await db.delete(aiCharacters)
      .where(
        and(
          eq(aiCharacters.id, parseInt(id)),
          eq(aiCharacters.userId, session.user.id)
        )
      )
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json({ error: 'Character not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}