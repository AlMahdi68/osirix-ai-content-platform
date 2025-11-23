import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { wallets, withdrawalRequests } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session) {
      return NextResponse.json({ 
        error: 'Authentication required',
        code: 'UNAUTHORIZED'
      }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { amount, method, paymentDetails } = body;

    // Validate required fields
    if (!amount) {
      return NextResponse.json({ 
        error: 'Amount is required',
        code: 'MISSING_AMOUNT'
      }, { status: 400 });
    }

    if (!method) {
      return NextResponse.json({ 
        error: 'Payment method is required',
        code: 'MISSING_METHOD'
      }, { status: 400 });
    }

    if (!paymentDetails) {
      return NextResponse.json({ 
        error: 'Payment details are required',
        code: 'MISSING_PAYMENT_DETAILS'
      }, { status: 400 });
    }

    // Validate amount is a number
    if (typeof amount !== 'number' || isNaN(amount)) {
      return NextResponse.json({ 
        error: 'Amount must be a valid number',
        code: 'INVALID_AMOUNT'
      }, { status: 400 });
    }

    // Validate method is one of allowed values
    const allowedMethods = ['paypal', 'bank_transfer', 'stripe'];
    if (!allowedMethods.includes(method)) {
      return NextResponse.json({ 
        error: 'Invalid payment method. Must be one of: paypal, bank_transfer, stripe',
        code: 'INVALID_METHOD'
      }, { status: 400 });
    }

    // Validate minimum withdrawal amount
    const minimumAmount = 1000; // $10 in cents
    if (amount < minimumAmount) {
      return NextResponse.json({ 
        error: 'Minimum withdrawal amount is $10',
        code: 'AMOUNT_TOO_LOW'
      }, { status: 400 });
    }

    // Fetch user's wallet
    const userWallet = await db.select()
      .from(wallets)
      .where(eq(wallets.userId, session.user.id))
      .limit(1);

    if (userWallet.length === 0) {
      return NextResponse.json({ 
        error: 'Wallet not found',
        code: 'WALLET_NOT_FOUND'
      }, { status: 404 });
    }

    const wallet = userWallet[0];

    // Check if balance is sufficient
    if (wallet.balance < amount) {
      return NextResponse.json({ 
        error: 'Insufficient balance',
        code: 'INSUFFICIENT_BALANCE'
      }, { status: 400 });
    }

    // Create withdrawal request
    const newWithdrawalRequest = await db.insert(withdrawalRequests)
      .values({
        userId: session.user.id,
        walletId: wallet.id,
        amount,
        method,
        paymentDetails,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .returning();

    return NextResponse.json(newWithdrawalRequest[0], { status: 201 });

  } catch (error) {
    console.error('POST /api/wallet/withdraw error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
      code: 'INTERNAL_ERROR'
    }, { status: 500 });
  }
}