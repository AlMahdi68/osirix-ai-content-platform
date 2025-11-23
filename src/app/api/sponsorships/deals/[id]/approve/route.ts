import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { db } from '@/db';
import { sponsorshipDeals, wallets, transactions, user } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Authentication check
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const authenticatedUser = session.user;

    // Get deal ID from params
    const { id } = await params;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { 
          error: 'Valid deal ID is required',
          code: 'INVALID_DEAL_ID'
        },
        { status: 400 }
      );
    }

    const parsedDealId = parseInt(id);

    // Fetch the deal
    const deal = await db.select()
      .from(sponsorshipDeals)
      .where(eq(sponsorshipDeals.id, parsedDealId))
      .limit(1);

    if (deal.length === 0) {
      return NextResponse.json(
        { error: 'Deal not found' },
        { status: 404 }
      );
    }

    const currentDeal = deal[0];

    // Check if authenticated user is the brand
    if (currentDeal.brandUserId !== authenticatedUser.id) {
      return NextResponse.json(
        { 
          error: 'Only the brand can approve content',
          code: 'FORBIDDEN'
        },
        { status: 403 }
      );
    }

    // Validate deal status
    if (currentDeal.status !== 'content_submitted') {
      return NextResponse.json(
        { 
          error: 'Deal status must be content_submitted to approve',
          code: 'INVALID_STATUS',
          currentStatus: currentDeal.status
        },
        { status: 400 }
      );
    }

    // Check if content URLs are present
    if (!currentDeal.contentUrls || (Array.isArray(currentDeal.contentUrls) && currentDeal.contentUrls.length === 0)) {
      return NextResponse.json(
        { 
          error: 'No content has been submitted yet',
          code: 'NO_CONTENT_SUBMITTED'
        },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    // Update deal status to approved
    const approvedDeal = await db.update(sponsorshipDeals)
      .set({
        status: 'approved',
        updatedAt: now
      })
      .where(eq(sponsorshipDeals.id, parsedDealId))
      .returning();

    // Get brand information for transaction description
    const brandInfo = await db.select()
      .from(user)
      .where(eq(user.id, currentDeal.brandUserId))
      .limit(1);

    const brandName = brandInfo.length > 0 ? brandInfo[0].name : 'Brand';

    // Get or create influencer's wallet
    let influencerWallet = await db.select()
      .from(wallets)
      .where(eq(wallets.userId, currentDeal.influencerUserId))
      .limit(1);

    let walletId: number;

    if (influencerWallet.length === 0) {
      // Create new wallet for influencer
      const newWallet = await db.insert(wallets)
        .values({
          userId: currentDeal.influencerUserId,
          balance: currentDeal.agreedPayment,
          pendingBalance: 0,
          totalEarnings: currentDeal.agreedPayment,
          totalWithdrawn: 0,
          createdAt: now,
          updatedAt: now
        })
        .returning();

      walletId = newWallet[0].id;
    } else {
      // Update existing wallet
      walletId = influencerWallet[0].id;
      const currentBalance = influencerWallet[0].balance;
      const currentTotalEarnings = influencerWallet[0].totalEarnings;

      await db.update(wallets)
        .set({
          balance: currentBalance + currentDeal.agreedPayment,
          totalEarnings: currentTotalEarnings + currentDeal.agreedPayment,
          updatedAt: now
        })
        .where(eq(wallets.id, walletId));
    }

    // Create transaction record
    const transaction = await db.insert(transactions)
      .values({
        walletId: walletId,
        userId: currentDeal.influencerUserId,
        type: 'earning',
        amount: currentDeal.agreedPayment,
        status: 'completed',
        sourceType: 'sponsorship',
        sourceId: currentDeal.id,
        description: `Sponsorship payment from ${brandName}`,
        metadata: {
          dealId: currentDeal.id,
          opportunityId: currentDeal.opportunityId,
          brandUserId: currentDeal.brandUserId
        },
        createdAt: now,
        updatedAt: now
      })
      .returning();

    // Update deal status to paid and set payment release timestamp
    const paidDeal = await db.update(sponsorshipDeals)
      .set({
        status: 'paid',
        paymentReleasedAt: now,
        updatedAt: now
      })
      .where(eq(sponsorshipDeals.id, parsedDealId))
      .returning();

    // Get updated wallet balance
    const updatedWallet = await db.select()
      .from(wallets)
      .where(eq(wallets.id, walletId))
      .limit(1);

    return NextResponse.json({
      deal: paidDeal[0],
      transaction: transaction[0],
      wallet: {
        balance: updatedWallet[0].balance,
        totalEarnings: updatedWallet[0].totalEarnings
      }
    }, { status: 200 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}