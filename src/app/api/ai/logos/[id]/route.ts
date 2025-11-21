import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { db } from '@/db';
import { aiLogos } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authentication check
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    // Get and validate ID parameter
    const { id } = await params;
    const logoId = parseInt(id);
    
    if (!id || isNaN(logoId)) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Fetch logo with user ownership check
    const logo = await db
      .select()
      .from(aiLogos)
      .where(and(eq(aiLogos.id, logoId), eq(aiLogos.userId, session.user.id)))
      .limit(1);

    if (logo.length === 0) {
      return NextResponse.json(
        { error: 'AI logo not found', code: 'LOGO_NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json({ logo: logo[0] }, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authentication check
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    // Get and validate ID parameter
    const { id } = await params;
    const logoId = parseInt(id);
    
    if (!id || isNaN(logoId)) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if logo exists and belongs to user
    const existingLogo = await db
      .select()
      .from(aiLogos)
      .where(and(eq(aiLogos.id, logoId), eq(aiLogos.userId, session.user.id)))
      .limit(1);

    if (existingLogo.length === 0) {
      return NextResponse.json(
        { error: 'AI logo not found', code: 'LOGO_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Delete the logo
    const deleted = await db
      .delete(aiLogos)
      .where(and(eq(aiLogos.id, logoId), eq(aiLogos.userId, session.user.id)))
      .returning();

    return NextResponse.json(
      { success: true, logo: deleted[0] },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}