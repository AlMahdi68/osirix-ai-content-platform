import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { wallets } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Authenticate user using better-auth session
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    // Query wallet for authenticated user
    const existingWallet = await db
      .select()
      .from(wallets)
      .where(eq(wallets.userId, session.user.id))
      .limit(1);

    // If wallet exists, return it
    if (existingWallet.length > 0) {
      const wallet = existingWallet[0];
      return NextResponse.json({
        id: wallet.id,
        balance: wallet.balance,
        pendingBalance: wallet.pendingBalance,
        totalEarnings: wallet.totalEarnings,
        totalWithdrawn: wallet.totalWithdrawn,
        createdAt: wallet.createdAt,
        updatedAt: wallet.updatedAt
      }, { status: 200 });
    }

    // Wallet doesn't exist, create one with all balances at 0
    const now = new Date().toISOString();
    const newWallet = await db
      .insert(wallets)
      .values({
        userId: session.user.id,
        balance: 0,
        pendingBalance: 0,
        totalEarnings: 0,
        totalWithdrawn: 0,
        createdAt: now,
        updatedAt: now
      })
      .returning();

    // Return the newly created wallet
    const wallet = newWallet[0];
    return NextResponse.json({
      id: wallet.id,
      balance: wallet.balance,
      pendingBalance: wallet.pendingBalance,
      totalEarnings: wallet.totalEarnings,
      totalWithdrawn: wallet.totalWithdrawn,
      createdAt: wallet.createdAt,
      updatedAt: wallet.updatedAt
    }, { status: 200 });

  } catch (error) {
    console.error('GET wallet error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}